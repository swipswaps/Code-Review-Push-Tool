import React, { useState } from 'react';
import { TreeNode } from '../types';
import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderIcon } from './Icons';

interface FileExplorerProps {
  tree: TreeNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ tree, selectedFile, onSelectFile }) => {
  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <TreeNodeComponent
        key={node.path}
        node={node}
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
      />
    ));
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-gray-900 py-2">File Explorer</h3>
      <ul>{renderTree(tree)}</ul>
    </div>
  );
};

interface TreeNodeComponentProps {
  node: TreeNode;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ node, selectedFile, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState(node.depth < 1); // Open top-level folders by default

  const isFolder = node.type === 'folder';
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <li style={{ paddingLeft: `${node.depth * 1.25}rem` }}>
      <div
        onClick={handleClick}
        className={`flex items-center p-1.5 rounded-md cursor-pointer text-sm transition-colors ${
          isSelected ? 'bg-blue-500/30 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        {isFolder ? (
          <>
            {isOpen ? <ChevronDownIcon className="w-4 h-4 mr-2 flex-shrink-0" /> : <ChevronRightIcon className="w-4 h-4 mr-2 flex-shrink-0" />}
            <FolderIcon className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
          </>
        ) : (
          <FileIcon className="w-5 h-5 mr-2 text-blue-400 ml-6 flex-shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileExplorer;
