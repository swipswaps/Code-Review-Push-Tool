import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-white" {...props} />,
        p: ({node, ...props}) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
        li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
        code: ({node, inline, className, children, ...props}) => {
          const match = /language-(\w+)/.exec(className || '');
          if (!inline && match) {
            // Note: For actual syntax highlighting, a library like react-syntax-highlighter is needed here.
            // For now, we provide good styling for code blocks.
            return (
              <pre className="bg-gray-900 rounded-md p-3 my-4 overflow-x-auto">
                <code className="text-sm font-mono text-gray-300" {...props}>
                  {children}
                </code>
              </pre>
            );
          }
          // Handle inline code
          return (
            <code className="bg-gray-700 text-sm font-mono text-blue-400 py-0.5 px-1 rounded" {...props}>
              {children}
            </code>
          );
        },
        pre: ({node, ...props}) => <div {...props} />, // The `code` component above handles the <pre> tag styling
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;