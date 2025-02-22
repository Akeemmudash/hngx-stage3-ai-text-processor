import { motion } from "framer-motion";
import SelectButton from "./SelectButton";
import { useChatContext } from "../hooks/useChatContext";

const FormArea = () => {
  const {
    handleInputText,
    handleKeyDown,
    inputRef,
    handleSend,
    selectedLangOption,
    setSelectedLangOption,
    canTranslate,
    translate,
    lastUserMessage,
  } = useChatContext();
  return (
    <div className="relative min-h-[150px] w-full rounded-4xl bg-indigo-100/55 px-5 pt-4 pb-16 shadow-md">
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
  );
};

export default FormArea;
