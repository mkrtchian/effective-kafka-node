import { KafkaConsumerMock } from "../../adapters/out/KafkaConsumerMock.js";
import { KafkaPublisherMock } from "../../adapters/out/KafkaPublisherMock.js";
import { Stage1Message } from "../ports/out/StreamingConsumerPort.js";
import { Stage1Consumer } from "./Stage1Consumer.js";

describe("Stage 1 consumer use case", () => {
  it("consumes events and publishes the same events with their value being squared, to another topic", async () => {
    // Given
    const kafkaConsumerMock = new KafkaConsumerMock();
    const kafkaPublisherMock = new KafkaPublisherMock();
    const initialMessages: Stage1Message[] = [
      {
        offset: "0",
        value: Buffer.from(
          JSON.stringify({
            id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
            value: 3.5,
          })
        ),
        headers: {},
      },
      {
        offset: "1",
        value: Buffer.from(
          JSON.stringify({
            id: "9d91c234-d740-4385-9938-d7f3d111a544",
            value: -2.2,
          })
        ),
        headers: {},
      },
      {
        offset: "2",
        value: Buffer.from(
          JSON.stringify({
            id: "55211639-1502-40fb-8dc8-a2b2b5f90584",
            value: 41.3,
          })
        ),
        headers: {},
      },
    ];
    kafkaConsumerMock.setMessages(initialMessages);
    const loggerMock = { log: jest.fn() };
    const sut = new Stage1Consumer(
      kafkaConsumerMock,
      kafkaPublisherMock,
      loggerMock
    );

    // When
    await sut.handle();

    // Then
    kafkaPublisherMock.shouldHavePublished([
      {
        topicName: "transactionalFlowStage2",
        data: {
          id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
          squaredValue: 12.25,
        },
      },
      {
        topicName: "transactionalFlowStage2",
        data: {
          id: "9d91c234-d740-4385-9938-d7f3d111a544",
          squaredValue: 4.84,
        },
      },
      {
        topicName: "transactionalFlowStage2",
        data: {
          id: "55211639-1502-40fb-8dc8-a2b2b5f90584",
          squaredValue: 1705.69,
        },
      },
    ]);
  });
});
