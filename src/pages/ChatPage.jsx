import React, { useState } from "react";
import SelectButton from "../components/SelectButton";
import { motion } from "framer-motion";
import astronaut from "../assets/astronaut.svg";

import { translateLang } from "../utils/helpers";
import { useScrollToMessage } from "../hooks/useScrollToMessage";
import useProcessMessage from "../hooks/useProcessMessage";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
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
  const responseMsgs = messages.filter((msg) => msg.type === "response");
  const chatContainerRef = useScrollToMessage(messages);

  return (
    <main className="flex h-screen min-h-[600px] bg-gray-100">
      <aside className="absolute hidden h-full w-xs bg-indigo-100 lg:static lg:block"></aside>
      <section className="flex-1">
        <div className="mx-auto flex h-full max-w-5xl flex-col px-4 pb-4">
          <h1 className="font-road-rage top-0 mb-2 h-[100px] w-full pt-5 text-center text-5xl text-indigo-600">
            AI Text Processor
          </h1>

          <div className="mt-auto flex flex-1 flex-col gap-10">
            <div
              ref={chatContainerRef}
              className="chat-area max-h-[calc(100vh-300px)] flex-1 space-y-20 overflow-y-auto rounded-2xl bg-white p-8 shadow-md"
            >
              {messages.length > 0 ? (
                messages.map(
                  (msg) =>
                    msg.type === "user" && (
                      <div key={msg.id} className="space-y-6">
                        <div className="ml-auto md:max-w-1/2" key={msg.id}>
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
                          <p className="inline-block rounded-xl bg-indigo-100 px-2 py-2 text-xs text-indigo-400 md:text-sm">
                            Detected language:{" "}
                            <span className="font-medium">
                              {msg.detectedLanguage !== ""
                                ? translateLang(msg.detectedLanguage)
                                : "Loading"}
                            </span>
                          </p>
                          {canSummarize(msg.id) && (
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => summarize()}
                              whileHover={{ scale: 1.05 }}
                              className="ms-2 px-2 py-2 text-sm text-indigo-500 md:ms-4"
                            >
                              summarize
                            </motion.button>
                          )}
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
                    onInput={handleInputText}
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
                  {lastUserMessage && canTranslate && (
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
