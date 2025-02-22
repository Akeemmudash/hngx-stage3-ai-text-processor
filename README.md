# AI-Powered Text Processing Interface

## Overview

The AI-Powered Text Processing Interface is a web application that allows users to input text and utilize Chrome's AI APIs for summarization, translation, and language detection. The UI is structured like a chat interface, where users input text, see immediate feedback, and perform text processing actions.

## Features

- **Chat Interface:** Users input text into a textarea field, and the output appears in a chat-like format.
- **Language Detection:** Detects the input text's language and displays it below the output text.
- **Text Summarization:** If the output text exceeds 150 characters and is in English, a "Summarize" button appears to generate a concise summary.
- **Translation:** Users can select from a list of languages (English, Portuguese, Spanish, Russian, Turkish, and French) and translate the output text using the "Translate" button.
- **Error Handling:** Displays clear error messages when API calls fail or invalid input is detected.
- **Responsive & Accessible Design:** Optimized layout for desktop, tablet, and mobile screens with ARIA labels for screen readers.

## Technologies Used

- HTML
- CSS
- JavaScript (Vanilla JS or TypeScript)
- React / Next.js (Recommended but not required)
- Chrome AI APIs:
  - Summarizer API
  - Translator API
  - Language Detection API

## How It Works

1. Users input text into the textarea and click the send button.
2. The text appears in the output area like a chat message.
3. The detected language is displayed below the output text.
4. If the text is over 150 characters and in English, a "Summarize" button appears.
5. Users can select a target language from a dropdown menu and click "Translate" to translate the output text.
6. The translated and/or summarized output appears below the original output text.

## Project Structure

```text
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   ├── astronaut.svg
│   │   └── react.svg
│   ├── components
│   │   ├── FormArea.jsx
│   │   ├── SelectButton.jsx
│   │   └── TextAreaInput.jsx
│   ├── context
│   │   ├── ChatContext.js
│   │   └── ChatContextProvider.jsx
│   ├── data
│   │   └── data.js
│   ├── hooks
│   │   ├── useChatContext.js
│   │   ├── useProcessMessage.js
│   │   └── useScrollToMessage.js
│   ├── pages
│   │   └── ChatPage.jsx
│   ├── styles
│   │   └── index.css
│   ├── utils
│   │   ├── cn.js
│   │   ├── detector.js
│   │   ├── generateID.js
│   │   ├── helpers.js
│   │   ├── message.js
│   │   ├── summarizer.js
│   │   └── translator.js
│   ├── main.jsx
└── └── App.jsx

```

## How to Run the Application

1. Clone the repository:
   ```sh
   git clone https://github.com/Akeemmudash/hngx-stage3-ai-text-processor.git
   cd hngx-stage3-ai-text-processor
   ```
2. Install dependencies (if using React):
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173/`.

## Live Demo

You can view a live demo here: [Live Demo Link](https://x-line-ai-text-processor.netlify.app/)

## Acknowledgments

- [HNG Internship](https://hng.tech) for providing this task.
- Special thanks to mentors and peers for their guidance and support.

## Submission Details

- Host the application on a platform (Netlify, Vercel, etc.).
- Submit the hosted page URL and GitHub repository link.
- Verify functionality, responsiveness, and accessibility before submission.
- **Submission Deadline:** February 21st, 2025, 11:59 PM WAT.
