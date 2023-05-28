/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/require-await */
import { StreamingPublisherPort } from "../../core/ports/out/StreamingPublisherPort.js";
import { Stage2Event } from "../../core/services/events.js";

export class KafkaPublisherMock implements StreamingPublisherPort {
  private _messages: { topicName: string; data: Stage2Event }[];

  constructor() {
    this._messages = [];
  }

  async publish(topicName: string, data: Stage2Event) {
    this._messages.push({
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
      expect(this._messages[i].topicName).toBe(expectedMessages[i].topicName);
      expect(this._messages[i].data.id).toBe(expectedMessages[i].data.id);
      expect(this._messages[i].data.squaredValue).toBeCloseTo(
        expectedMessages[i].data.squaredValue,
        5
      );
    }
  }
}
