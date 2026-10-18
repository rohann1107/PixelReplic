import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../../lib/formatting';

interface ScreenshotUploadProps {
  onFileSelected: (file: File | null, dataUrl: string | null) => void;
  selectedFile: File | null;
  selectedDataUrl: string | null;
  onClear: () => void;
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({
  onFileSelected,
  selectedFile,
  selectedDataUrl,
  onClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

  const processFile = (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported format. Please upload a PNG, JPEG, or WebP image.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(`File is too large (${formatBytes(file.size)}). Maximum supported limit is 10 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        onFileSelected(file, dataUrl);
      };
      img.onerror = () => {
        setErrorMessage('Failed to read image dimensions. Please try another screenshot.');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setErrorMessage('Could not load file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageDimensions(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleInputChange}
        className="hidden"
        id="screenshot-file-input"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-900/50'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload screenshot drag and drop zone"
        >
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="text-brand-600 dark:text-brand-400 hover:underline">Click to upload</span> or drag and drop screenshot
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              PNG, JPG, or WebP up to 10 MB (Enables 100% exact canvas color extraction)
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800/80 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {selectedDataUrl ? (
              <img
                src={selectedDataUrl}
                alt="Uploaded screenshot preview"
                className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {selectedFile.name}
                </p>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatBytes(selectedFile.size)}
                {imageDimensions && ` • ${imageDimensions.width} × ${imageDimensions.height} px`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Remove uploaded screenshot"
            aria-label="Remove uploaded screenshot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
