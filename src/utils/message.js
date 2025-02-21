import { generateID } from "./generateID";

class Message {
  constructor(inputText, messageType) {
    this.id = generateID();
    this.text = inputText;
    this.type = messageType;
    this.date = new Date();
  }
}

class UserMessage extends Message {
  constructor(inputText, detectedLanguage = "", confidence = 0) {
    super(inputText, "user");
    this.detectedLanguage = detectedLanguage;
    this.confidence = confidence;
  }
}

class ResponseMessage extends Message {
  constructor(processedText, selectedLangOption, userMsgID, status) {
    super(processedText, "response");
    this.userMsgID = userMsgID;
    this.translatedTo = selectedLangOption;
    this.status = status;
  }
}

export { Message, UserMessage, ResponseMessage };
