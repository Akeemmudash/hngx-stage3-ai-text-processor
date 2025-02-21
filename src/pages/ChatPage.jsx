import React, { useRef, useState } from "react";
import SelectButton from "../components/SelectButton";
import { motion } from "framer-motion";
import astronaut from "../assets/astronaut.svg";
import { detector } from "../utils/detector";
import { translator } from "../utils/translator";
import { summarizer } from "../utils/summarizer";
import { getLastUserMessage, translateLang } from "../utils/helpers";
import { UserMessage, ResponseMessage } from "../utils/message";
import { getLastResponseMessage } from "../utils/helpers";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLangOption, setSelectedLangOption] = useState("en");
  const responseMsgs = messages.filter((msg) => msg.type === "response");
  const formerLangSelection = useRef(selectedLangOption);
  const inputRef = useRef(null);

  const lastUserMessage = getLastUserMessage(messages);
  console.log("lastUserMessage", lastUserMessage);
  const lastResponseMessage = getLastResponseMessage(messages);
  console.log("lastResponseMessage", lastResponseMessage);
  const languageDetected = lastUserMessage?.detectedLanguage;

  const shouldTranslate =
    languageDetected !== selectedLangOption ||
    formerLangSelection.current !== selectedLangOption;

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = new UserMessage(inputText);
    handleMessage(newMessage);
    setInputText("");
    if (inputRef.current) inputRef.current.textContent = "";

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
      if (!shouldTranslate) return;
      handleMessage(new ResponseMessage("", "", userMsgID, "loading"));
      const result = await processFn();
      console.log("result", result);
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
      const summarizerFn = await summarizer();
      return await summarizerFn.summarize();
    }, lastUserMessage.id);
  };

  return (
    <main className="flex h-screen min-h-[600px] bg-gray-100">
      <aside className="absolute hidden h-full w-xs bg-indigo-100 lg:static lg:block"></aside>
      <section className="flex-1">
        <div className="mx-auto flex h-full max-w-5xl flex-col px-4 pb-4">
          <h1 className="font-road-rage top-0 mb-2 h-[100px] w-full pt-5 text-center text-5xl text-indigo-600">
            AI Text Processor
          </h1>

          <div className="mt-auto flex flex-1 flex-col gap-10">
            <div className="chat-area max-h-[calc(100vh-300px)] flex-1 space-y-20 overflow-y-auto rounded-2xl bg-white p-8 shadow-md">
              {messages.length > 0 ? (
                messages.map(
                  (msg) =>
                    msg.type === "user" && (
                      <div key={msg.id} className="space-y-6">
                        <div className="ml-auto max-w-1/2" key={msg.id}>
                          <div
                            className={
                              "relative my-2 rounded-xl bg-indigo-500 p-4 text-white"
                            }
                          >
                            {msg.text}
                            {msg.date && (
                              <time
                                className="absolute right-2 bottom-1 text-xs text-white"
                                dateTime={msg.date.toISOString()}
                              >
                                {msg.date.toLocaleTimeString()}
                              </time>
                            )}
                          </div>
                          <p className="inline-block rounded-xl bg-indigo-100 px-2 py-2 text-sm text-indigo-400">
                            Detected language:{" "}
                            <span className="font-medium">
                              {msg.detectedLanguage !== ""
                                ? translateLang(msg.detectedLanguage)
                                : "Loading"}
                            </span>
                          </p>
                          {
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => summarize()}
                              className="ms-4 border border-indigo-500 px-2 py-2 text-sm text-indigo-500"
                            >
                              summarize
                            </motion.button>
                          }
                        </div>
                        {responseMsgs
                          .filter((response) => response.userMsgID === msg.id)
                          .map((responseMsg) => (
                            <React.Fragment key={responseMsg.id}>
                              <div
                                className={`relative my-2 rounded-xl border p-4 ${responseMsg.status === "error" ? "border-red-500 text-red-500" : "border-indigo-400 text-indigo-500"}`}
                              >
                                {responseMsg.status === "loading" ? (
                                  "Loading..."
                                ) : responseMsg.status === "error" ? (
                                  responseMsg.text
                                ) : responseMsg.translatedTo ? (
                                  <>
                                    <b>
                                      {translateLang(responseMsg.translatedTo)}{" "}
                                      Translation:
                                    </b>
                                    <br />
                                    {responseMsg.text}
                                  </>
                                ) : null}
                              </div>
                            </React.Fragment>
                          ))}
                      </div>
                    ),
                )
              ) : (
                <div className="mx-auto flex h-full max-w-3xs flex-col items-center justify-center gap-2">
                  <img src={astronaut} alt="Astronaut illustration" />
                  <p>Your messages will appear here</p>
                </div>
              )}
            </div>

            <div className="relative h-[150px] w-full rounded-4xl bg-indigo-100/55 px-5 pt-6 pb-16 shadow-md">
              <form onSubmit={handleSend}>
                <div className="ml-auto flex w-full max-w-2xl items-center">
                  <div
                    className="max-h-[100px] flex-1 overflow-auto rounded-full bg-indigo-100 p-4 px-10 text-gray-700 focus:outline-none"
                    contentEditable="true"
                    rows="2"
                    onInput={(e) => setInputText(e.target.textContent)}
                    onKeyDown={handleKeyDown}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text/plain");
                      document.execCommand("insertText", false, text);
                    }}
                    ref={inputRef}
                  ></div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="ml-2 rounded-full bg-indigo-600 p-3 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                        fill="white"
                      />
                    </svg>
                  </motion.button>
                </div>

                <div className="absolute bottom-3 left-10 flex items-center gap-4">
                  <SelectButton
                    selectedOption={selectedLangOption}
                    setSelectedOption={setSelectedLangOption}
                  />
                  {lastUserMessage && shouldTranslate && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => translate(lastUserMessage.id)}
                      className="border border-indigo-500 px-2 py-2 text-sm text-indigo-500"
                    >
                      Translate
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChatInterface;
