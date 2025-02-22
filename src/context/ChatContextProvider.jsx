import { useState } from "react";
import { useScrollToMessage } from "../hooks/useScrollToMessage";
import { ChatContext } from "./ChatContext";
import useProcessMessage from "../hooks/useProcessMessage";

export const ChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const responseMsgs = messages.filter((msg) => msg.type === "response");
  const chatContainerRef = useScrollToMessage(messages);
  const {
    summarize,
    translate,
    handleInputText,
    handleSend,
    handleKeyDown,
    selectedLangOption,
    setSelectedLangOption,
    inputRef,
    canTranslate,
    canSummarize,
    lastUserMessage,
  } = useProcessMessage(messages, setMessages);
  return (
    <ChatContext.Provider
      value={{
        summarize,
        translate,
        handleInputText,
        handleSend,
        handleKeyDown,
        selectedLangOption,
        setSelectedLangOption,
        inputRef,
        canTranslate,
        canSummarize,
        responseMsgs,
        chatContainerRef,
        lastUserMessage,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
