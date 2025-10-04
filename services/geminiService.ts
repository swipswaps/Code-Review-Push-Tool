import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCodeReview(code: string): Promise<string> {
  const prompt = `
    You are an expert Senior Software Engineer acting as a code reviewer.
    Your task is to provide a comprehensive, constructive, and friendly code review for the provided files, and then generate a summary commit message.

    **Overall Summary Section:**
    - First, provide a high-level summary of your findings across all files.
    - This summary should highlight recurring patterns, critical issues, and overall code quality.
    - Start this section with the exact heading: \`###OVERALL-SUMMARY###\`.

    **Review Section:**
    - After the summary, analyze the following code files and provide a detailed review.
    - For EACH file, create a section with the file path as a heading (e.g., \`## src/components/Button.tsx\`).
    - Under each file heading, provide your feedback on potential bugs, performance, readability, and best practices as a bulleted list.
    - Use Markdown for formatting. If a file is excellent, state that explicitly.

    **Commit Message Section:**
    - After completing the file-by-file review, add a new section starting with the exact heading: \`###COMMIT-MESSAGE###\`.
    - On the line immediately following this heading, provide a single, concise Git commit message that summarizes the suggested changes.
    - The commit message should follow the Conventional Commits specification (e.g., "refactor: Simplify component logic for better readability").

    Here is the code to review:
    ${code}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get code review from Gemini API.");
  }
}