/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/require-await */
import { StreamingPublisherPort } from "../../core/ports/out/StreamingPublisherPort.js";
import { CustomerEvent } from "../../core/services/customerEvents.js";

export class KafkaPublisherMock implements StreamingPublisherPort {
  private _messages: { topicName: string; data: CustomerEvent }[];

  constructor() {
    this._messages = [];
  }

  async publish(topicName: string, data: CustomerEvent) {
    this._messages.push({
      topicName,
      data,
    });
    return [{ baseOffset: "0" }];
  }

  async connect() {}

  async disconnect() {}

  shouldHavePublished(
    expectedMessages: { topicName: string; data: CustomerEvent }[]
  ) {
    for (let i = 0; i < expectedMessages.length; i++) {
      expect(this._messages[i]).toEqual(expectedMessages[i]);
    }
  }
}
