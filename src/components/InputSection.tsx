import { useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface InputSectionProps {
  inputMode: 'file' | 'text';
  onInputModeChange: (mode: 'file' | 'text') => void;
  transcriptText: string;
  onTranscriptChange: (text: string) => void;
  onFileUpload: (file: File) => void;
  onSubmit: () => void | Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function InputSection({
  inputMode,
  onInputModeChange,
  transcriptText,
  onTranscriptChange,
  onFileUpload,
  onSubmit,
  isLoading,
  error,
}: InputSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onInputModeChange('text')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            inputMode === 'text'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => onInputModeChange('file')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            inputMode === 'file'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload File
        </button>
      </div>

      {/* Input Area */}
      {inputMode === 'file' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            Drop .txt file here or click to upload
          </p>
          {transcriptText && (
            <p className="mt-2 text-sm text-green-600">
              File loaded ({transcriptText.length} characters)
            </p>
          )}
        </div>
      ) : (
        <textarea
          value={transcriptText}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-[200px] px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}

      {/* Generate Button */}
      <button
        onClick={onSubmit}
        disabled={!transcriptText.trim() || isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Action Items'
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
