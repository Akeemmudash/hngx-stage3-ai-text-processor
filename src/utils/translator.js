const translator = async (sourceLanguage, targetLanguage) => {
  const aiTranslator = await self.ai.translator.create({
    sourceLanguage,
    targetLanguage,
  });

  return aiTranslator;
};

export { translator };
