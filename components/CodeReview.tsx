import React from 'react';
import type { FileData } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { SparklesIcon } from './Icons';

interface CodeReviewProps {
  file: FileData | undefined;
  review: string | undefined;
  summary: string | undefined;
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

const SummaryView: React.FC<{ summary: string }> = ({ summary }) => (
  <div className="h-full bg-gray-800 p-6 overflow-auto">
    <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Overall Summary</h2>
    </div>
    <MarkdownRenderer content={summary} />
  </div>
);


const CodeReview: React.FC<CodeReviewProps> = ({ file, review, summary }) => {
  if (!file) {
    if (summary) {
      return <SummaryView summary={summary} />;
    }
    return (
      <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
        <p>Select a file from the left panel to view its code and specific review.</p>
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
            <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                <p>No review available for this file. It might have been skipped or an error occurred.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CodeReview;