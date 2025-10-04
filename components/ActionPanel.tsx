import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface ActionPanelProps {
  commitMessage: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ commitMessage }) => {
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const gitCommands = `git add .
git commit -m "${commitMessage.replace(/"/g, '\\"')}"
git push`;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(commitMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>

      <div className="bg-gray-700 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-white">Suggested Commit Message</h4>
          <button
            onClick={handleCopyMessage}
            className="p-1.5 bg-gray-600 hover:bg-blue-500/50 rounded-md transition-colors"
            aria-label="Copy commit message"
          >
            {copiedMessage ? (
              <CheckIcon className="w-4 h-4 text-green-400" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-sm bg-gray-800 p-2 rounded-md font-mono text-gray-300">
          {commitMessage}
        </p>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Push to GitHub</h4>
        <p className="text-sm text-gray-400 mb-4">
          After applying changes, use these commands in your terminal to push the code.
        </p>

        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm text-gray-300 relative">
          <pre>{gitCommands}</pre>
          <button
            onClick={handleCopyCommands}
            className="absolute top-2 right-2 p-1.5 bg-gray-600 hover:bg-blue-500/50 rounded-md transition-colors"
            aria-label="Copy git commands"
          >
            {copiedCommands ? (
              <CheckIcon className="w-4 h-4 text-green-400" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-auto pt-4 text-xs text-gray-500 border-t border-gray-700">
        <strong>Disclaimer:</strong> AI-generated reviews are suggestions. Always verify changes and test your code thoroughly before deployment.
      </div>
    </div>
  );
};

export default ActionPanel;