import type { FileData, ReviewResult, FullReview } from './types';

export function processFiles(fileList: FileList, includedExtensionsStr: string): Promise<{ fileData: FileData[], formattedContent: string }> {
  const allowedExtensions = new Set(
    includedExtensionsStr
      .split(',')
      .map(ext => ext.trim().toLowerCase())
      .filter(Boolean)
      .map(ext => ext.startsWith('.') ? ext : `.${ext}`)
  );

  const readFile = (file: File): Promise<FileData | null> => {
    return new Promise((resolve) => {
      const fileNameLower = file.name.toLowerCase();

      // Filter based on extension if a list is provided
      let isExtensionAllowed = true;
      if (allowedExtensions.size > 0) {
        isExtensionAllowed = Array.from(allowedExtensions).some(ext => fileNameLower.endsWith(ext));
      }

      // Basic check to avoid binary files.
      const isLikelyTextFile = !file.type || file.type.startsWith('text/') || file.type.includes('json') || file.type.includes('xml') || file.type.includes('javascript');
      
      if (file.size > 2 * 1024 * 1024 || !isExtensionAllowed || !isLikelyTextFile) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve({
            path: (file as any).webkitRelativePath || file.name,
            content: event.target.result,
          });
        } else {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    });
  };

  return new Promise(async (resolve) => {
    const filePromises = Array.from(fileList).map(readFile);
    const results = await Promise.all(filePromises);
    const fileData = results.filter((r): r is FileData => r !== null);

    const formattedContent = fileData.map(file => 
      `--- FILE: ${file.path} ---\n${file.content}`
    ).join('\n\n');

    resolve({ fileData, formattedContent });
  });
}

export function parseGeminiResponse(jsonString: string): FullReview {
  try {
    const parsed = JSON.parse(jsonString);

    // Validate the structure of the parsed object
    if (!parsed.summary || typeof parsed.summary !== 'string' ||
        !parsed.commitMessage || typeof parsed.commitMessage !== 'string' ||
        !Array.isArray(parsed.reviews)) {
      throw new Error("Invalid review structure received from API.");
    }
    
    const reviewMap: ReviewResult = new Map();
    for (const review of parsed.reviews) {
      if (review.filePath && typeof review.filePath === 'string' &&
          review.feedback && typeof review.feedback === 'string') {
        reviewMap.set(review.filePath, review.feedback);
      }
    }
    
    return {
      summary: parsed.summary,
      commitMessage: parsed.commitMessage,
      review: reviewMap,
    };

  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    let errorMessage = "Could not parse the review data from the AI. The response may be malformed.";
    if (error instanceof Error) {
        errorMessage = `Could not parse the review data from the AI: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}