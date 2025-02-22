import React from "react";
import { motion } from "framer-motion";
import astronaut from "../assets/astronaut.svg";

import { mapLangCode } from "../utils/helpers";
import FormArea from "../components/FormArea";
import { useChatContext } from "../hooks/useChatContext";

const ChatInterface = () => {
  const { chatContainerRef, messages, canSummarize, summarize, responseMsgs } =
    useChatContext();
  return (
    <main className="flex h-screen min-h-[600px] bg-gray-100">
      <section className="flex-1">
        <div className="mx-auto flex h-full max-w-5xl flex-col px-4 pb-4">
          <h1 className="font-road-rage top-0 mb-2 h-[100px] w-full pt-5 text-center text-5xl text-indigo-600">
            AI Text Processor
          </h1>

          <div className="mt-auto flex flex-1 flex-col gap-5 md:gap-8">
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
                                ? mapLangCode(msg.detectedLanguage)
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
                                      {mapLangCode(responseMsg.translatedTo)}{" "}
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

            <FormArea />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChatInterface;
