import { languageMap } from "../data";

export const getLastUserMessage = (messages) => {
  return [...messages].reverse().find((msg) => msg.type === "user") || null;
};
export const getLastResponseMessage = (messages) => {
  return [...messages].reverse().find((msg) => msg.type === "response") || null;
};

export const translateLang = (language) => {
  const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  return languageMap[language] || languageNames.of(language);
};
