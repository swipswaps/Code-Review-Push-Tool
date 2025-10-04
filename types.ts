export interface FileData {
  path: string;
  content: string;
}

export type ReviewResult = Map<string, string>;

export interface FullReview {
    review: ReviewResult;
    commitMessage: string;
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';
