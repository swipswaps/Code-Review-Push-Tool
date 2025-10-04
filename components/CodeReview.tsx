
import React from 'react';
import type { FileData } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface CodeReviewProps {
  file: FileData | undefined;
  review: string | undefined;
}

const CodeView: React.FC<{ content: string }> = ({ content }) => (
  <div className="h-full bg-gray-900 text-gray-200 p-4 overflow-auto font-mono text-sm">
    <pre><code>{content}</code></pre>
  </div>
);

const ReviewView: React.FC<{ review: string }> = ({ review }) => (
  <div className="h-full bg-gray-800 p-4 overflow-auto">
    <MarkdownRenderer content={review} />
  </div>
);


const CodeReview: React.FC<CodeReviewProps> = ({ file, review }) => {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select a file to view its code and review.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 h-full">
      <div className="flex flex-col h-full border-r border-gray-700">
        <div className="bg-gray-700 p-2 font-semibold text-white border-b border-gray-600 truncate">{file.path}</div>
        <CodeView content={file.content} />
      </div>
      <div className="flex flex-col h-full">
        <div className="bg-gray-700 p-2 font-semibold text-white border-b border-gray-600">Review</div>
        {review ? (
            <ReviewView review={review} />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500 p-4">
                <p>No review available for this file. It might have been skipped or an error occurred.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CodeReview;
