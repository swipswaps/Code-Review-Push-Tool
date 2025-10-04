# AI Code Reviewer

An automated code review tool that uses the Google Gemini API to analyze your code, provide feedback with actionable suggestions, and help you prepare for a GitHub push. Simply upload a folder of code to get started.

## Features

-   **Folder Upload**: Easily upload your entire project folder for a comprehensive review.
-   **AI-Powered Analysis**: Leverages the `gemini-2.5-flash` model for intelligent code review.
-   **Hierarchical File Explorer**: Navigate your project's file structure with an intuitive, collapsible tree view.
-   **Syntax Highlighting**: Code is displayed with language-aware syntax highlighting for enhanced readability.
-   **Actionable Suggestions**: The AI provides not just feedback but also concrete code suggestions that you can apply with a single click.
-   **Automated Commit Messages**: Generates a conventional commit message based on the review summary.
-   **Granular Loading States**: Provides clear feedback during file processing and AI analysis.
-   **Robust Error Handling**: Displays clear, user-friendly error messages with an option to retry.

## Tech Stack

-   **Frontend**: React, TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Markdown**: `react-markdown`
-   **Syntax Highlighting**: `react-syntax-highlighter`

## Local Setup and Installation

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   **Node.js**: Version 18.x or higher. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm**: Node Package Manager, which comes bundled with Node.js.
-   **Google Gemini API Key**: You need an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step-by-Step Instructions

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd gemini-code-reviewer
    ```

2.  **Install dependencies:**
    This command will read the `package.json` file and install all the necessary libraries.
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    The application needs your Gemini API key to function. Create a new file in the root of the project directory named `.env.local`.
    ```bash
    touch .env.local
    ```
    Open this file and add your API key. **The `VITE_` prefix is required by Vite.**
    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    Replace `YOUR_API_KEY_HERE` with your actual key. The `.gitignore` file is already configured to ignore this file, so your key will not be accidentally committed.

4.  **Run the development server:**
    This command starts the Vite development server.
    ```bash
    npm run dev
    ```
    You should see output indicating that the server is running, typically on `http://localhost:5173`.

5.  **Open the application:**
    Open your web browser and navigate to `http://localhost:5173`. You should now see the application running.

## Usage

1.  Click the "Select Folder" button and choose a project folder from your local machine.
2.  The application will process the supported files and send them to the Gemini API for review.
3.  Wait for the review to complete. You will see status updates for "Processing files..." and "Gemini is reviewing your code...".
4.  Once the review is done, you will see a high-level summary.
5.  Use the File Explorer on the left to navigate between files.
6.  For each file, view the original code and the AI's feedback side-by-side.
7.  Apply any actionable suggestions with the "Apply Suggestion" button.
8.  Use the Action Panel on the right to copy the AI-generated commit message and the corresponding git commands.
