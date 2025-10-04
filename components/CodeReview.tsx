import React from 'react';
import { Review } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { LoadingSpinner } from './Icons';

interface CodeReviewProps {
  selectedFileContent: string | null;
  review: Review | null;
  isLoading: boolean;
}

const CodeReview: React.FC<CodeReviewProps> = ({ selectedFileContent, review, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <LoadingSpinner className="w-12 h-12 mb-4" />
          <p>Analyzing file...</p>
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

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Code View */}
        <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-2 text-white sticky top-0 bg-gray-900 pb-2">{review.filePath}</h3>
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
            <code>{selectedFileContent}</code>
          </pre>
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
