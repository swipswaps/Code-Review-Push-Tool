
import React from 'react';
import type { FileData } from '../types';
import { FileIcon } from './Icons';

interface FileExplorerProps {
  files: FileData[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, selectedFile, onSelectFile }) => {
  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold text-white p-2 mb-2">Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.path}>
            <button
              onClick={() => onSelectFile(file.path)}
              className={`w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${
                selectedFile === file.path
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-gray-700/50'
              }`}
            >
              <FileIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{file.path}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
