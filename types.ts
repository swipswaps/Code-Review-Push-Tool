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