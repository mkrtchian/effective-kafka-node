/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/require-await, @typescript-eslint/no-unused-vars */
import {
  Stage1Message,
  Stage2Event,
  TransactionalStreamingPort,
} from "../../core/ports/out/TransactionalStreamingPort.js";

export class TransactionalKafkaMock implements TransactionalStreamingPort {
  private _incomingMessages: Stage1Message[];
  private _outgoingMessages: { topicName: string; data: Stage2Event }[];

  constructor() {
    this._incomingMessages = [];
    this._outgoingMessages = [];
  }

  runConsumer(callback: (message: Stage1Message) => void) {
    for (const message of this._incomingMessages) {
      callback(message);
    }
    return Promise.resolve();
  }

  setMessages(messages: Stage1Message[]) {
    this._incomingMessages = messages;
  }

  async subscribe(topicName: string, options: { fromBeginning: boolean }) {
    return Promise.resolve();
  }

  async publish(topicName: string, data: Stage2Event) {
    this._outgoingMessages.push({
      topicName,
      data,
    });
    return [{ baseOffset: "0" }];
  }

  async connect() {}

  async disconnect() {}

  shouldHavePublished(
    expectedMessages: { topicName: string; data: Stage2Event }[]
  ) {
    for (let i = 0; i < expectedMessages.length; i++) {
      expect(this._outgoingMessages[i]).toEqual(expectedMessages[i]);
    }
    return this;
  }

  shouldHavePublishedNumberOfMessages(numberOfMessages: number) {
    expect(this._outgoingMessages.length).toBe(numberOfMessages);
    return this;
  }
}
