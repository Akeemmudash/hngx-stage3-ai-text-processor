import { useEffect, useRef } from "react";

const useScrollToMessage = (messages) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return chatContainerRef;
};

export { useScrollToMessage };
