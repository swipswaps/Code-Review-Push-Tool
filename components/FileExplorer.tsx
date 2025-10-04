import React, { useState, useEffect } from 'react';
import type { TreeNode } from '../types';
import { FileIcon, FolderIcon, FolderOpenIcon, ChevronRightIcon, ChevronDownIcon } from './Icons';

interface FileExplorerProps {
  tree: TreeNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
}> = ({ node, selectedFile, onSelectFile, expandedFolders, toggleFolder }) => {
  const isExpanded = expandedFolders.has(node.path);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => toggleFolder(node.path)}
          className="w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm hover:bg-gray-700/50"
          style={{ paddingLeft: `${node.depth * 1.25 + 0.5}rem` }}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronDownIcon className="w-4 h-4 flex-shrink-0" /> : <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />}
          {isExpanded ? <FolderOpenIcon className="w-4 h-4 flex-shrink-0 text-blue-400" /> : <FolderIcon className="w-4 h-4 flex-shrink-0 text-blue-400" />}
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && (
          <div>
            {node.children.map(child => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // It's a file
  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${
        selectedFile === node.path
          ? 'bg-blue-500/20 text-blue-400'
          : 'hover:bg-gray-700/50 text-gray-300'
      }`}
      style={{ paddingLeft: `${node.depth * 1.25 + 0.5}rem` }}
    >
      <div className="w-4 h-4 flex-shrink-0" style={{ marginLeft: '0.5rem' }} /> {/* Spacer for alignment */}
      <FileIcon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
};


const FileExplorer: React.FC<FileExplorerProps> = ({ tree, selectedFile, onSelectFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Initial expansion of all top-level folders
  useEffect(() => {
    if (tree.length > 0) {
      const initialExpanded = new Set<string>();
      tree.forEach(node => {
        if (node.type === 'folder') {
          initialExpanded.add(node.path);
        }
      });
      setExpandedFolders(initialExpanded);
    }
  }, [tree]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold text-white p-2 mb-2">Files</h3>
      <div className="flex flex-col">
        {tree.map(node => (
          <TreeNodeComponent
            key={node.path}
            node={node}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;