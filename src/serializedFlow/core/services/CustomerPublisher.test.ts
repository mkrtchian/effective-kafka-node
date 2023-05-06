import { KafkaPublisherMock } from "../../adapters/out/KafkaPublisherMock.js";
import { CustomerPublisher } from "./CustomerPublisher.js";

describe("Customer publisher use case", () => {
  it("publishes specific customer events to event streaming broker", async () => {
    // Given
    const kafkaPublisherMock = new KafkaPublisherMock();
    const sleeperMock = { sleep: jest.fn() };
    const loggerMock = { log: jest.fn() };
    const sut = new CustomerPublisher(
      kafkaPublisherMock,
      sleeperMock,
      loggerMock
    );

    // When
    await sut.handle();

    // Then
    kafkaPublisherMock.shouldHavePublished([
      {
        topicName: "serializedFlow",
        data: {
          id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
          firstName: "John",
          lastName: "Doe",
          type: "customer_created",
        },
      },
      {
        topicName: "serializedFlow",
        data: {
          id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
          firstName: "Jane",
          lastName: "Doe",
          type: "customer_created",
        },
      },
      {
        topicName: "serializedFlow",
        data: {
          id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
          type: "customer_suspended",
        },
      },
      {
        topicName: "serializedFlow",
        data: {
          id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
          firstName: "Jenny",
          type: "customer_updated",
        },
      },
    ]);
  });
});
