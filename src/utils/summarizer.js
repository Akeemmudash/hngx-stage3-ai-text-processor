const summarizer = async () => {
  const options = {
    type: "key-points",
    format: "markdown",
    length: "medium",
  };

  const available = (await self.ai.summarizer.capabilities()).available;
  let summarizerObject;
  if (available === "no") {
    throw new Error("Summary not available on this device");
  }
  if (available === "readily") {
    summarizerObject = await self.ai.summarizerObject.create(options);
  } else {
    summarizerObject = await self.ai.summarizerObject.create(options);
    await summarizerObject.ready;
  }
  return summarizerObject;
};

export { summarizer };
