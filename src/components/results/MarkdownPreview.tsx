import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Code } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../lib/formatting';

interface MarkdownPreviewProps {
  content: string;
  filename: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, filename }) => {
  const [copied, setCopied] = useState(false);
  const [viewRaw, setViewRaw] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(filename, content, 'text/markdown;charset=utf-8');
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {filename}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({content.split('\n').length} lines)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Raw View */}
          <button
            type="button"
            onClick={() => setViewRaw((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewRaw
                ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Toggle Raw / Rendered"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{viewRaw ? 'Rendered View' : 'Raw Markdown'}</span>
          </button>

          {/* Highlighted Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/25'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy {filename}</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title={`Download ${filename}`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto max-h-[750px] leading-relaxed">
        {viewRaw ? (
          <pre className="font-mono text-xs whitespace-pre-wrap text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            {content}
          </pre>
        ) : (
          <div className="font-sans text-sm text-slate-800 dark:text-slate-200 tracking-[-0.01em] space-y-4 max-w-none">
            {/* Simple, safe structured renderer */}
            {content.split('\n\n').map((block, idx) => {
              if (block.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white border-b pb-3 border-slate-200 dark:border-slate-800 tracking-tight">
                    {block.replace(/^# /, '')}
                  </h1>
                );
              }
              if (block.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-4 pb-1.5 border-b border-slate-100 dark:border-slate-800/80 tracking-tight">
                    {block.replace(/^## /, '')}
                  </h2>
                );
              }
              if (block.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base font-semibold text-slate-800 dark:text-slate-200 pt-2">
                    {block.replace(/^### /, '')}
                  </h3>
                );
              }
              if (block.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {block.replace(/^#### /, '')}
                  </h4>
                );
              }
              if (block.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-4 border-brand-500 pl-4 py-1 italic bg-brand-50/40 dark:bg-brand-950/20 text-slate-700 dark:text-slate-300 rounded-r-lg">
                    {block.replace(/^> /gm, '')}
                  </blockquote>
                );
              }
              if (block.startsWith('```')) {
                const codeContent = block.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
                return (
                  <pre key={idx} className="p-4 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-xs shadow-inner">
                    <code>{codeContent}</code>
                  </pre>
                );
              }
              if (block.startsWith('|')) {
                const rows = block.trim().split('\n');
                return (
                  <div key={idx} className="overflow-x-auto my-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                      {rows.map((row, rIdx) => {
                        if (row.includes('---')) return null;
                        const cells = row.split('|').filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                        if (rIdx === 0) {
                          return (
                            <thead key={rIdx} className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                              <tr>
                                {cells.map((cell, cIdx) => (
                                  <th key={cIdx} className="px-3 py-2 text-left">
                                    {cell.trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          );
                        }
                        return (
                          <tbody key={rIdx} className="divide-y divide-slate-100 dark:divide-slate-800/40">
                            <tr>
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                  {cell.trim()}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                );
              }
              if (block.startsWith('- ') || block.startsWith('* ')) {
                const items = block.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^[-*]\s+/, '')}</li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(block)) {
                const items = block.split('\n');
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^\d+\.\s+/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
