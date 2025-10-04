import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reviewSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A high-level summary of findings across all files, highlighting recurring patterns, critical issues, and overall code quality. This should be formatted as Markdown.",
    },
    commitMessage: {
      type: Type.STRING,
      description: "A single, concise Git commit message that summarizes the suggested changes, following the Conventional Commits specification.",
    },
    reviews: {
      type: Type.ARRAY,
      description: "A list of detailed reviews for each file.",
      items: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description: "The full path of the file being reviewed.",
          },
          feedback: {
            type: Type.STRING,
            description: "Constructive feedback on potential bugs, performance, readability, and best practices as a Markdown-formatted string. If a file is excellent, state that explicitly.",
          },
        },
        required: ["filePath", "feedback"],
      },
    },
  },
  required: ["summary", "commitMessage", "reviews"],
};


export async function getCodeReview(code: string): Promise<string> {
  const prompt = `
    You are an expert Senior Software Engineer acting as a code reviewer.
    Your task is to provide a comprehensive, constructive, and friendly code review for the provided files.
    Your response must be a JSON object that adheres to the provided schema.

    Please provide the following:
    1.  **summary**: A high-level summary of your findings across all files. Highlight recurring patterns, critical issues, and overall code quality. Format this as a Markdown string.
    2.  **commitMessage**: A single, concise Git commit message that summarizes the suggested changes. This message should follow the Conventional Commits specification (e.g., "refactor: Simplify component logic for better readability").
    3.  **reviews**: An array of review objects, one for each file. Each object must have:
        - **filePath**: The path of the file.
        - **feedback**: A detailed, Markdown-formatted review of the file, covering potential bugs, performance, readability, and best practices. If a file is excellent, state that.

    Here is the code to review:
    ${code}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: reviewSchema,
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
     if (error instanceof Error && error.message.includes('response is not valid JSON')) {
      throw new Error("The AI model returned a response that was not valid JSON. This may be a temporary issue. Please try again.");
    }
    throw new Error("Failed to get code review from Gemini API.");
  }
}