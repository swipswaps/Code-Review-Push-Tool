import type { FileData, ReviewResult, FullReview } from './types';

export function processFiles(fileList: FileList): Promise<{ fileData: FileData[], formattedContent: string }> {
  const readFile = (file: File): Promise<FileData | null> => {
    return new Promise((resolve) => {
      // Basic filtering for common text-based source code files
      const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.py', '.rb', '.java', '.go', '.rs', '.php', '.sh'];
      const isTextFile = allowedExtensions.some(ext => file.name.endsWith(ext)) || !file.name.includes('.');

      if (file.size > 2 * 1024 * 1024 || !isTextFile) { // Skip files larger than 2MB or non-text files
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

export function parseGeminiResponse(markdown: string): FullReview {
  const reviewMap: ReviewResult = new Map();
  let commitMessage = 'feat: Apply AI-suggested code improvements'; // Default message

  const commitMessageSeparator = '###COMMIT-MESSAGE###';
  const parts = markdown.split(commitMessageSeparator);

  const reviewSection = parts[0];
  if (parts.length > 1 && parts[1].trim()) {
    commitMessage = parts[1].trim().split('\n')[0]; // Take the first line after separator
  }
  
  // Split by Markdown H2, which we expect to be file paths
  const fileSections = reviewSection.split(/(?=^##\s)/m);

  for (const section of fileSections) {
    if (section.trim() === '') continue;
    
    const lines = section.split('\n');
    const header = lines[0];
    const filePathMatch = header.match(/^##\s+(.*)/);
    
    if (filePathMatch && filePathMatch[1]) {
      const filePath = filePathMatch[1].trim();
      const content = lines.slice(1).join('\n').trim();
      reviewMap.set(filePath, content);
    }
  }
  
  return { review: reviewMap, commitMessage };
}
