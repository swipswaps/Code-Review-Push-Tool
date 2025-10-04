
import React, { useRef } from 'react';
import { FolderIcon } from './Icons';

interface FileUploaderProps {
  onFileSelect: (files: FileList) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(event.target.files);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
        <FolderIcon className="w-24 h-24 mx-auto text-gray-500" />
        <h2 className="mt-6 text-xl font-semibold text-white">Start Your Code Review</h2>
        <p className="mt-2 text-sm text-gray-400">
          Select a folder containing your source code to get started.
        </p>
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
