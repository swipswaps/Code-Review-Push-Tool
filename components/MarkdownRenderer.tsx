
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLines = () => {
    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 mb-4">
            {listItems.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };
    
    const flushCodeBlock = () => {
      if(inCodeBlock && codeBlockContent.length > 0) {
         elements.push(
          <pre key={`code-${elements.length}`} className="bg-gray-900 rounded-md p-3 my-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-300">{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      }
    }


    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if(inCodeBlock) {
          flushCodeBlock();
        } else {
          flushList();
          inCodeBlock = true;
        }
        continue;
      }
      
      if(inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-white" dangerouslySetInnerHTML={{__html: line.substring(4)}} />);
      } else if (line.match(/^(\*|-)\s/)) {
        const itemContent = line.replace(/^(\*|-)\s/, '').replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-sm font-mono text-blue-400 py-0.5 px-1 rounded">\$1</code>');
        listItems.push(itemContent);
      } else {
        flushList();
        elements.push(<p key={i} className="mb-4 text-gray-300" dangerouslySetInnerHTML={{__html: line.replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-sm font-mono text-blue-400 py-0.5 px-1 rounded">\$1</code>')}} />);
      }
    }
    
    flushList();
    flushCodeBlock();

    return elements;
  };

  return <div className="prose prose-invert max-w-none text-gray-300">{renderLines()}</div>;
};

export default MarkdownRenderer;
