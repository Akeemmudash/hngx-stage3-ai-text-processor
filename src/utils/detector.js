const detector = async (inputText) => {
  const languageDetectorCapabilities =
    await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.capabilities;
  let detector;
  if (canDetect === "no") {
    return;
  }
  if (canDetect === "readily") {
    detector = await self.ai.languageDetector.create();
  } else {
    detector = await self.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
    await detector.ready;
  }

  return await detector.detect(inputText);
};

export { detector };
