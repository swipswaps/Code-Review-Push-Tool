import React, { useState, useEffect, useCallback } from 'react';
import { getCodeReview } from './services/geminiService';
import { processFiles, parseGeminiResponse } from './utils/fileUtils';
import type { FileData, FullReview, AppState } from './types';
import FileUploader from './components/FileUploader';
import FileExplorer from './components/FileExplorer';
import CodeReview from './components/CodeReview';
import ActionPanel from './components/ActionPanel';
import { SparklesIcon, WarningIcon } from './components/Icons';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [review, setReview] = useState<FullReview | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (fileList: FileList, extensions: string) => {
    if (fileList.length === 0) return;
    setAppState('loading');
    setError(null);
    setFiles([]);
    setReview(null);
    setSelectedFilePath(null);
    
    try {
      const { fileData, formattedContent } = await processFiles(fileList, extensions);
      setFiles(fileData);
      
      if (fileData.length > 0) {
        setSelectedFilePath(null); // Show summary view first
        const geminiResponse = await getCodeReview(formattedContent);
        const parsedReview = parseGeminiResponse(geminiResponse);
        setReview(parsedReview);
        setAppState('success');
      } else {
        setError("No files matching the specified extensions were found.");
        setAppState('error');
      }
    } catch (e) {
      console.error(e);
      let errorMessage = 'An unexpected error occurred. Please check the console for details.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      setAppState('error');
    }
  };

  const selectedFile = files.find(f => f.path === selectedFilePath);
  const selectedFileReview = review?.review.get(selectedFilePath || '');

  const renderContent = () => {
    switch (appState) {
      case 'idle':
        return <FileUploader onFileSelect={handleFileSelect} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <SparklesIcon className="w-16 h-16 animate-pulse" />
            <p className="mt-4 text-lg">Gemini is reviewing your code...</p>
            <p className="text-sm">This may take a moment.</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <WarningIcon className="w-16 h-16 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-white">An Error Occurred</h2>
            <p className="mt-1 text-gray-400">The review could not be completed. Please see the details below.</p>
            <div className="mt-4 mb-6 p-4 bg-gray-800 border border-red-500/50 rounded-lg max-w-2xl w-full text-left">
              <p className="text-sm font-semibold text-red-400 mb-1">Error Details:</p>
              <p className="text-sm text-red-300 font-mono whitespace-pre-wrap">{error}</p>
            </div>
            <button
              onClick={() => setAppState('idle')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        );
      case 'success':
        return (
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-3 bg-gray-800 rounded-lg overflow-y-auto">
              <FileExplorer 
                files={files} 
                selectedFile={selectedFilePath} 
                onSelectFile={setSelectedFilePath} 
              />
            </div>
            <div className="col-span-6 bg-gray-800 rounded-lg overflow-hidden">
              <CodeReview 
                file={selectedFile} 
                review={selectedFileReview} 
                summary={review?.summary}
              />
            </div>
            <div className="col-span-3 bg-gray-800 rounded-lg overflow-y-auto">
              {review && <ActionPanel commitMessage={review.commitMessage} />}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 font-sans">
      <header className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Gemini Code Reviewer</h1>
        </div>
        {appState === 'success' && (
           <button
             onClick={() => setAppState('idle')}
             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
           >
             Review New Code
           </button>
        )}
      </header>
      <main className="h-[calc(100vh-8rem)]">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;