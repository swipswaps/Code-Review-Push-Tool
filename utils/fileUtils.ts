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