import React from 'react';
import { Review } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { LoadingSpinner } from './Icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeReviewProps {
  selectedFileContent: string | null;
  review: Review | null;
  isLoading: boolean;
}

const getLanguage = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase() || 'text';
    const langMap: { [key: string]: string } = {
        js: 'javascript',
        jsx: 'jsx',
        ts: 'typescript',
        tsx: 'tsx',
        py: 'python',
        rb: 'ruby',
        java: 'java',
        go: 'go',
        rs: 'rust',
        php: 'php',
        sh: 'bash',
        md: 'markdown',
        json: 'json',
        html: 'html',
        css: 'css',
        scss: 'scss',
    };
    return langMap[extension] || 'text';
};

const CodeReview: React.FC<CodeReviewProps> = ({ selectedFileContent, review, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <LoadingSpinner className="w-12 h-12 mb-4" />
          <p>Analyzing files...</p>
        </div>
      );
    }

    if (!selectedFileContent || !review) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Select a file to see its review.</p>
        </div>
      );
    }

    const language = getLanguage(review.filePath);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Code View */}
        <div className="bg-gray-900 rounded-lg overflow-hidden flex flex-col">
          <h3 className="text-sm font-semibold text-gray-300 sticky top-0 bg-gray-900 p-3 border-b border-gray-700 flex-shrink-0">{review.filePath}</h3>
          <div className="overflow-auto h-full">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{ margin: 0, height: '100%', backgroundColor: '#121212' }}
              codeTagProps={{ style: { fontFamily: '"Fira Code", monospace' } }}
            >
              {selectedFileContent}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Review View */}
        <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-2 text-white sticky top-0 bg-gray-800 pb-2">Code Review</h3>
          <MarkdownRenderer content={review.suggestions} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-full">
      {renderContent()}
    </div>
  );
};

export default CodeReview;
