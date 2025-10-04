import React, { useRef, useState } from 'react';
import { FolderIcon } from './Icons';

interface FileUploaderProps {
  onFileSelect: (files: FileList, extensions: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [extensions, setExtensions] = useState('.js,.jsx,.ts,.tsx,.html,.css,.json,.md,.py,.rb,.java,.go,.rs,.php,.sh');

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(event.target.files, extensions);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg max-w-lg w-full">
        <FolderIcon className="w-24 h-24 mx-auto text-gray-500" />
        <h2 className="mt-6 text-xl font-semibold text-white">Start Your Code Review</h2>
        <p className="mt-2 text-sm text-gray-400">
          Select a folder and specify which file types to review.
        </p>

        <div className="mt-6 w-full mx-auto">
          <label htmlFor="extensions" className="block text-sm font-medium text-gray-400 mb-2">
            File extensions to review (comma-separated):
          </label>
          <input
            id="extensions"
            type="text"
            value={extensions}
            onChange={(e) => setExtensions(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder=".js, .ts, .py, .html..."
          />
        </div>

        <button
          onClick={handleFolderClick}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Select Folder
        </button>
        <input
          type="file"
          ref={folderInputRef}
          onChange={handleFileChange}
          className="hidden"
          // @ts-ignore
          webkitdirectory="true"
          directory="true"
        />
        <p className="mt-4 text-xs text-gray-500">
          Your code is processed locally and only sent for review. We don't store it.
        </p>
      </div>
    </div>
  );
};

export default FileUploader;