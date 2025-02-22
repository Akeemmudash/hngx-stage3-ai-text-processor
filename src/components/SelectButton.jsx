import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { languageMap } from "../data";

const SelectButton = ({ selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const languageCodes = Object.keys(languageMap);
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!isOpen) return;

      const currentIndex = languageCodes.indexOf(selectedOption);
      if (event.key === "ArrowDown") {
        setSelectedOption(
          languageCodes[(currentIndex + 1) % languageCodes.length],
        );
      } else if (event.key === "ArrowUp") {
        setSelectedOption(
          languageCodes[
            (currentIndex - 1 + languageCodes.length) % languageCodes.length
          ],
        );
      } else if (event.key === "Enter") {
        setIsOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedOption, setSelectedOption, languageCodes]);

  const toggleSelect = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block" ref={selectRef}>
      <button
        className="not-even: flex items-center justify-between rounded-full bg-indigo-400 px-4 py-2 text-white shadow-md hover:bg-indigo-500"
        onClick={toggleSelect}
      >
        {languageMap[selectedOption]}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M16.293 8.29309L12 12.5861L7.70697 8.29309L6.29297 9.70709L12 15.4141L17.707 9.70709L16.293 8.29309Z"
              fill="white"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-8 left-0 z-20 mt-2 mb-6 w-full overflow-hidden rounded-lg bg-indigo-300 text-center text-white shadow-lg"
        >
          {languageCodes.map((code, index) => (
            <li
              key={index}
              className={`cursor-pointer px-4 py-2 ${
                selectedOption === code
                  ? "bg-indigo-500"
                  : "hover:bg-indigo-400/75"
              }`}
              onClick={() => {
                setSelectedOption(code);
                setIsOpen(false);
              }}
            >
              {languageMap[code]}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default SelectButton;
