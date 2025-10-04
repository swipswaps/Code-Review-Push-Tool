import type { FileData, TreeNode } from '../types';

export function buildFileTree(files: FileData[]): TreeNode[] {
  const root: TreeNode = { name: 'root', path: '', type: 'folder', children: [], depth: -1 };

  for (const file of files) {
    // Normalize paths to always use forward slashes
    const parts = file.path.split('/');
    let currentNode = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const currentPath = parts.slice(0, i + 1).join('/');
      const isFile = i === parts.length - 1;
      
      let existingNode = currentNode.children.find(child => child.name === part && child.type === (isFile ? 'file' : 'folder'));

      if (existingNode) {
        currentNode = existingNode;
      } else {
        const newNode: TreeNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: [],
          depth: i,
        };
        currentNode.children.push(newNode);
        currentNode = newNode;
      }
    }
  }
  
  const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => {
          if (a.type === 'folder' && b.type === 'file') return -1;
          if (a.type === 'file' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
      });
      nodes.forEach(node => {
        if(node.children.length > 0) {
          sortNodes(node.children);
        }
      });
  };

  sortNodes(root.children);
  return root.children;
}
