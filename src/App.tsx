import React, { useState, useMemo } from 'react';
import FileUploader from './components/FileUploader';
import FileExplorer from './components/FileExplorer';
import CodeReview from './components/CodeReview';
import ActionPanel from './components/ActionPanel';
import { FileData, TreeNode, CodeReviewResult, AppState } from './types';
import { processFiles } from './utils/fileUtils';
import { buildFileTree } from './utils/tree';
import { runCodeReview } from './services/geminiService';
import { LoadingSpinner } from './components/Icons';

function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (fileList: FileList, extensions: string) => {
    setAppState('processing');
    setError(null);
    setFiles([]);
    setFileTree([]);
    setReviewResult(null);
    setSelectedFilePath(null);

    try {
      const processedFiles = await processFiles(fileList, extensions);
      if (processedFiles.length === 0) {
        setError("No valid files found. Please select a folder with supported file types.");
        setAppState('error');
        return;
      }
      
      setFiles(processedFiles);
      const tree = buildFileTree(processedFiles);
      setFileTree(tree);

      setAppState('reviewing');
      const result = await runCodeReview(processedFiles);
      setReviewResult(result);
      setAppState('success');

      const firstReviewedFile = result.reviews.find(r => r && r.suggestions && !r.suggestions.includes("No issues found."));
      if (firstReviewedFile) {
        setSelectedFilePath(firstReviewedFile.filePath);
      } else if (processedFiles.length > 0) {
        setSelectedFilePath(processedFiles[0].path);
      }

    } catch (err) {
      console.error("A detailed error occurred:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`An unexpected error occurred during the review process. Details: ${errorMessage}`);
      setAppState('error');
    }
  };

  const handleRetry = () => {
    setAppState('idle');
    setError(null);
  };
  
  const selectedFileContent = useMemo(() => {
    if (!selectedFilePath) return null;
    return files.find(f => f.path === selectedFilePath)?.content ?? null;
  }, [selectedFilePath, files]);

  const selectedFileReview = useMemo(() => {
    if (!selectedFilePath || !reviewResult) return null;
    return reviewResult.reviews.find(r => r.filePath === selectedFilePath) ?? null;
  }, [selectedFilePath, reviewResult]);


  if (appState !== 'success') {
    return (
      <div className="bg-gray-950 text-white min-h-screen">
        <main className="container mx-auto p-4 h-screen">
            {(appState === 'processing' || appState === 'reviewing') ? (
                 <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <LoadingSpinner className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-xl">
                            {appState === 'processing' ? 'Processing files...' : 'Gemini is reviewing your code...'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">This may take a moment.</p>
                    </div>
                </div>
            ) : appState === 'error' ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
                        <p className="text-gray-300 mb-6">We couldn't complete the code review.</p>
                        <div className="bg-gray-800 p-4 rounded-md text-left text-sm text-red-300 font-mono whitespace-pre-wrap">
                           {error}
                        </div>
                        <button
                          onClick={handleRetry}
                          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                          Retry
                        </button>
                    </div>
                </div>
            ) : (
                <FileUploader onFileSelect={handleFileSelect} />
            )}
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans">
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">AI Code Reviewer</h1>
      </header>
      <main className="grid grid-cols-12 h-[calc(100vh-65px)]">
        <aside className="col-span-3 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <FileExplorer 
            tree={fileTree} 
            selectedFile={selectedFilePath}
            onSelectFile={setSelectedFilePath}
          />
        </aside>
        <section className="col-span-6 bg-gray-800 overflow-y-auto">
           <CodeReview 
            selectedFileContent={selectedFileContent}
            review={selectedFileReview}
            isLoading={!reviewResult}
          />
        </section>
        <aside className="col-span-3 bg-gray-900 border-l border-gray-700 overflow-y-auto">
          {reviewResult ? (
            <ActionPanel commitMessage={reviewResult.commitMessage} />
          ) : (
             <div className="p-4 text-center text-gray-400 h-full flex items-center justify-center">
                <LoadingSpinner className="w-8 h-8 mr-2" />
                <p>Generating summary...</p>
             </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
