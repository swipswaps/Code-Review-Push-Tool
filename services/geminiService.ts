import { GoogleGenAI } from '@google/genai';
import { FileData, Review, CodeReviewResult, ReviewError } from '../types';

// FIX: Initialize GoogleGenAI with named apiKey parameter, using process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const reviewPrompt = (filePath: string, fileContent: string) => `
  You are an expert code reviewer. You are reviewing a file.
  The file path is: ${filePath}
  The file content is:
  \`\`\`
  ${fileContent}
  \`\`\`
  Please provide a code review for this file.
  Focus on:
  1.  Best practices and code quality.
  2.  Potential bugs or performance issues.
  3.  Clarity, readability, and maintainability.
  4.  Security vulnerabilities.

  Format your response in Markdown. If there are no issues, simply say "No issues found.".
  Do not include the file content in your response.
`;

const commitMessagePrompt = (reviews: Review[]) => `
  Based on the following code reviews, please generate a concise and descriptive git commit message.
  The commit message should summarize the changes made across all files.
  Format it as a conventional commit message (e.g., "feat: ...", "fix: ...", "refactor: ...").

  Reviews:
  ${reviews.map(r => `File: ${r.filePath}\nReview:\n${r.suggestions}`).join('\n\n---\n\n')}
`;

export async function getReviewForFile(file: FileData): Promise<Review | ReviewError> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: reviewPrompt(file.path, file.content),
    });
    // FIX: Access response text directly as per guidelines
    const suggestions = response.text;
    return { filePath: file.path, suggestions };
  } catch (error) {
    console.error(`Error reviewing file ${file.path}:`, error);
    return {
      filePath: file.path,
      error: `Failed to review file. Please check your API key and network connection.`,
    };
  }
}

export async function getCommitMessage(reviews: Review[]): Promise<string> {
  if (reviews.length === 0 || reviews.every(r => r.suggestions.includes("No issues found."))) {
    return "chore: No changes suggested by code review";
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: commitMessagePrompt(reviews),
    });
    // FIX: Access response text directly as per guidelines
    return response.text.trim();
  } catch (error) {
    console.error('Error generating commit message:', error);
    return 'fix: Apply automated code review suggestions';
  }
}

export async function runCodeReview(files: FileData[]): Promise<CodeReviewResult> {
    const reviewPromises = files.map(getReviewForFile);
    const results = await Promise.all(reviewPromises);

    const reviews: Review[] = [];
    const errors: ReviewError[] = [];

    results.forEach(result => {
        if ('error' in result) {
            errors.push(result);
            // Create a review with the error message to display it
            reviews.push({ filePath: result.filePath, suggestions: `**Error:** ${result.error}` });
        } else {
            reviews.push(result);
        }
    });

    const successfulReviews = reviews.filter(r => !r.suggestions.startsWith('**Error:**'));

    const commitMessage = await getCommitMessage(successfulReviews);
    
    return { commitMessage, reviews };
}
