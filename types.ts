export interface FileData {
  path: string;
  content: string;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: TreeNode[];
  depth: number;
}

export interface Review {
  filePath: string;
  suggestions: string; // Markdown content
}

export interface CodeReviewResult {
  commitMessage: string;
  reviews: Review[];
}

export interface ReviewError {
  filePath: string;
  error: string;
}
