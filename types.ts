export interface FileData {
  path: string;
  content: string;
}

export type ReviewResult = Map<string, string>;

export interface FullReview {
    review: ReviewResult;
    commitMessage: string;
    summary: string;
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: TreeNode[];
  depth: number;
}
