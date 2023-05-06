/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/require-await, @typescript-eslint/no-unused-vars */
import {
  CustomerMessage,
  StreamingConsumerPort,
} from "../../core/ports/out/StreamingConsumerPort.js";

export class KafkaConsumerMock implements StreamingConsumerPort {
  private _messages: CustomerMessage[];

  constructor() {
    this._messages = [];
  }

  runConsumer(callback: (message: CustomerMessage) => void) {
    for (const message of this._messages) {
      callback(message);
    }
    return Promise.resolve();
  }

  setMessages(messages: CustomerMessage[]) {
    this._messages = messages;
  }

  async subscribe(topicName: string, options: { fromBeginning: boolean }) {
    return Promise.resolve();
  }

  async connect() {}

  async disconnect() {}
}
