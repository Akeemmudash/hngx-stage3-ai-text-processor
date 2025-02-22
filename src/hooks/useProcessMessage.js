import { useRef, useState } from "react";
import { ResponseMessage, UserMessage } from "../utils/message";
import { detector } from "../utils/detector";
import { translator } from "../utils/translator";
import { summarizer } from "../utils/summarizer";
import { getLastUserMessage } from "../utils/helpers";
import { MINIMUM_WORD_SUMMARY } from "../data";

const useProcessMessage = (messages, setMessages) => {
  const [inputText, setInputText] = useState("");
  const [selectedLangOption, setSelectedLangOption] = useState("en");
  const formerLangSelection = useRef(selectedLangOption);
  const inputRef = useRef(null);

  const inputValue = inputRef?.current?.textContent;
  const lastUserMessage = getLastUserMessage(messages);
  const languageDetected = lastUserMessage?.detectedLanguage;

  const canTranslate =
    inputValue === "" &&
    languageDetected !== selectedLangOption &&
    formerLangSelection.current !== selectedLangOption;

  const userMsgCharCount = lastUserMessage?.text?.length;

  const canSummarize = (id) =>
    lastUserMessage.id === id && userMsgCharCount >= MINIMUM_WORD_SUMMARY;

  const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const updateMessage = (id, updates) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    );
  };

  const updateLoadingMessage = (response) =>
    setMessages((prev) =>
      prev
        .reverse()
        .map((msg) =>
          msg.status === "loading" ? { ...msg, ...response } : msg,
        ),
    );

  const handleInputText = (e) => setInputText(e.target.textContent);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = new UserMessage(inputText);
    handleMessage(newMessage);
    setInputText("");
    if (inputRef?.current) inputRef.current.textContent = "";

    try {
      const results = await detector(inputText);
      const topResult = results?.[0];
      updateMessage(newMessage.id, {
        confidence: topResult?.confidence,
        detectedLanguage: topResult?.detectedLanguage,
      });
      setSelectedLangOption("en");
    } catch (err) {
      console.error("Detection error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const processMessage = async (processFn, userMsgID) => {
    try {
      handleMessage(new ResponseMessage("", "", userMsgID, "loading"));
      const result = await processFn();
      updateLoadingMessage({
        ...new ResponseMessage(result, selectedLangOption, userMsgID, "ready"),
      });
      formerLangSelection.current = selectedLangOption;
    } catch (error) {
      console.error(error);
      updateLoadingMessage(
        new ResponseMessage(
          error.message,
          selectedLangOption,
          userMsgID,
          "error",
        ),
      );
    }
  };

  const translate = async () => {
    if (!lastUserMessage) return;
    processMessage(async () => {
      const translatorFn = await translator(
        formerLangSelection.current,
        selectedLangOption,
      );
      return await translatorFn.translate(lastUserMessage.text);
    }, lastUserMessage.id);
  };

  const summarize = async () => {
    if (!lastUserMessage) return;
    processMessage(async () => {
      const summarizerObject = await summarizer();

      return await summarizerObject.summarize(lastUserMessage.text);
    }, lastUserMessage.id);
  };
  return {
    summarize,
    translate,
    handleSend,
    handleKeyDown,
    handleInputText,
    setSelectedLangOption,
    selectedLangOption,
    inputRef,
    canTranslate,
    canSummarize,
    lastUserMessage,
  };
};

export default useProcessMessage;
