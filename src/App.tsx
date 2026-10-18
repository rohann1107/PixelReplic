import { useState, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/analyzer/HeroSection';
import { AnalyzerCard } from './components/analyzer/AnalyzerCard';
import { BlueprintPreviewCard } from './components/analyzer/BlueprintPreviewCard';
import { ProgressBar } from './components/feedback/ProgressBar';
import { ResultsWorkspace } from './components/results/ResultsWorkspace';
import { WorkflowSection } from './components/analyzer/WorkflowSection';
import { FeaturesSection } from './components/analyzer/FeaturesSection';
import { OutputPreviewSection } from './components/analyzer/OutputPreviewSection';
import { FaqSection } from './components/analyzer/FaqSection';
import { PrivacySection } from './components/analyzer/PrivacySection';
import { AnalysisResult, AnalyzerSettings, StepProgress } from './types';
import { runPixelSpecAnalysis } from './features/inspection/inspection-client';
import { AppError } from './lib/errors';

export function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<StepProgress | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentError, setCurrentError] = useState<AppError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const analyzerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (sectionId: string) => {
    if (analysisResult) {
      // If currently viewing results and navigating to landing sections, reset or scroll
      if (sectionId === 'hero' || sectionId === 'analyzer') {
        setAnalysisResult(null);
      }
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAnalyzer = () => {
    if (analysisResult) {
      setAnalysisResult(null);
    }
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
    const input = document.getElementById('target-url-input');
    if (input) {
      setTimeout(() => input.focus(), 300);
    }
  };

  const handleStartAnalysis = async (
    url: string,
    screenshotFile: File | null,
    screenshotDataUrl: string | null,
    settings: AnalyzerSettings
  ) => {
    setIsAnalyzing(true);
    setCurrentError(null);
    setAnalysisResult(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const result = await runPixelSpecAnalysis({
        url,
        screenshotFile,
        screenshotDataUrl,
        settings,
        onProgress: (p) => setProgress(p),
        signal: abortController.signal,
      });

      setAnalysisResult(result);
      setIsAnalyzing(false);
      setProgress(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsAnalyzing(false);
      setProgress(null);

      if (err.message === 'Analysis cancelled by user') {
        return;
      }

      if (err.category && err.title) {
        setCurrentError(err as AppError);
      } else {
        setCurrentError({
          category: 'UNKNOWN',
          title: 'Analysis Interrupted',
          message: err?.message || 'Failed to complete website design inspection.',
          suggestedAction: 'Please check the URL syntax or upload a screenshot to continue.',
        });
      }
    }
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsAnalyzing(false);
    setProgress(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Global Navigation */}
      <Navbar onNavigate={handleNavigate} onOpenAnalyzer={handleOpenAnalyzer} />

      <main className="flex-1">
        {analysisResult ? (
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <ResultsWorkspace result={analysisResult} onReset={handleReset} />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div id="hero">
              <HeroSection
                onAnalyzeClick={handleOpenAnalyzer}
                onExploreWorkflow={() => handleNavigate('workflow')}
              />
            </div>

            {/* Core Analyzer Card or Progress View */}
            <div id="analyzer" ref={analyzerRef} className="py-8 px-4 sm:px-6 lg:px-8">
              {isAnalyzing && progress ? (
                <ProgressBar progress={progress} onCancel={handleCancelAnalysis} />
              ) : (
                <>
                  <AnalyzerCard
                    onStartAnalysis={handleStartAnalysis}
                    isLoading={isAnalyzing}
                    currentError={currentError}
                    onClearError={() => setCurrentError(null)}
                  />
                  <BlueprintPreviewCard />
                </>
              )}
            </div>

            {/* How It Works Workflow Section */}
            <WorkflowSection />

            {/* Features Highlight Section */}
            <FeaturesSection />

            {/* File Tree Output Preview */}
            <OutputPreviewSection />

            {/* Detailed FAQ Section */}
            <FaqSection />

            {/* Privacy & Limitations Section */}
            <PrivacySection />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
