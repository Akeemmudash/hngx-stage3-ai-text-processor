import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChatInterface from "./pages/ChatPage.jsx";
import "./index.css";
import { ChatContextProvider } from "./Provider/ChatContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatContextProvider>
      <ChatInterface />
    </ChatContextProvider>
  </StrictMode>,
);
