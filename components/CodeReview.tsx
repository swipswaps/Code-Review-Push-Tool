import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { FileData } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { SparklesIcon } from './Icons';

interface CodeReviewProps {
  file: FileData | undefined;
  review: string | undefined;
  summary: string | undefined;
}

const languageMap: { [key: string]: string } = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  html: 'html',
  css: 'css',
  json: 'json',
  md: 'markdown',
  py: 'python',
  rb: 'ruby',
  java: 'java',
  go: 'go',
  rs: 'rust',
  php: 'php',
  sh: 'bash',
};

const getLanguage = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  return languageMap[extension] || 'plaintext';
};

const CodeView: React.FC<{ content: string; filePath: string }> = ({ content, filePath }) => (
  <div className="h-full text-sm">
    <SyntaxHighlighter
      language={getLanguage(filePath)}
      style={vscDarkPlus}
      showLineNumbers
      wrapLines={true}
      customStyle={{
        margin: 0,
        padding: '1rem',
        height: '100%',
        width: '100%',
        backgroundColor: '#121212', // Match gray-900
      }}
      codeTagProps={{
          style: {
              fontFamily: 'inherit',
          }
      }}
      lineNumberStyle={{
        minWidth: '2.25em',
        color: '#6b7280' // gray-500
      }}
    >
      {content}
    </SyntaxHighlighter>
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
        <CodeView content={file.content} filePath={file.path} />
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