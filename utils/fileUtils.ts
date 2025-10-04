import { FileData } from '../types';

export const processFiles = async (
  files: FileList,
  allowedExtensions: string
): Promise<FileData[]> => {
  const allowedExts = new Set(allowedExtensions.split(','));
  const fileDataPromises: Promise<FileData | null>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const extension = '.' + file.name.split('.').pop();
    
    // @ts-ignore - webkitRelativePath is a non-standard property
    const path = file.webkitRelativePath || file.name;

    if (allowedExts.has(extension) && path) {
      fileDataPromises.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) {
              resolve({ path, content });
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => {
            resolve(null);
          };
          reader.readAsText(file);
        })
      );
    }
  }

  const results = await Promise.all(fileDataPromises);
  return results.filter((file): file is FileData => file !== null);
};
