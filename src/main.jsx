import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChatInterface from "./pages/ChatPage.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatInterface />
  </StrictMode>
);
