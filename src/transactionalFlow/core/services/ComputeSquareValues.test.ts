import { KafkaConsumerMock } from "../../adapters/out/KafkaConsumerMock.js";
import { KafkaPublisherMock } from "../../adapters/out/KafkaPublisherMock.js";
import { Stage1Message } from "../ports/out/StreamingConsumerPort.js";
import { ComputeSquareValues } from "./ComputeSquareValues.js";

describe("Compute square values", () => {
  it("consumes events from stage 1 topic, and for each event publishes an event in stage 2 topic, with the value being the square of the consumed one", async () => {
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
    const sut = new ComputeSquareValues(
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
