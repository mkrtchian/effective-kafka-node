import { KafkaConsumerMock } from "../../adapters/out/KafkaConsumerMock.js";
import { CustomerMessage } from "../ports/out/StreamingConsumerPort.js";
import { CustomerConsumer } from "./CustomerConsumer.js";

describe("Customer consumer use case", () => {
  it("consumes and returns specific customer events from event streaming broker", async () => {
    // Given
    const kafkaConsumerMock = new KafkaConsumerMock();
    const initialMessages: CustomerMessage[] = [
      {
        offset: "0",
        value: Buffer.from(
          JSON.stringify({
            id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
            firstName: "John",
            lastName: "Doe",
            type: "customer_created",
          })
        ),
        headers: { type: "customer_created" },
      },
      {
        offset: "1",
        value: Buffer.from(
          JSON.stringify({
            id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
            firstName: "Jane",
            lastName: "Doe",
            type: "customer_created",
          })
        ),
        headers: { type: "customer_created" },
      },
      {
        offset: "2",
        value: Buffer.from(
          JSON.stringify({
            id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
            type: "customer_suspended",
          })
        ),
        headers: { type: "customer_suspended" },
      },
      {
        offset: "3",
        value: Buffer.from(
          JSON.stringify({
            id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
            firstName: "Jenny",
            type: "customer_updated",
          })
        ),
        headers: { type: "customer_updated" },
      },
    ];
    kafkaConsumerMock.setMessages(initialMessages);
    const loggerMock = { log: jest.fn() };
    const sut = new CustomerConsumer(kafkaConsumerMock, loggerMock);

    // When
    const customerEvents = await sut.handle();

    // Then
    expect(customerEvents).toEqual([
      {
        id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
        firstName: "John",
        lastName: "Doe",
        type: "customer_created",
      },
      {
        id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
        firstName: "Jane",
        lastName: "Doe",
        type: "customer_created",
      },
      {
        id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
        type: "customer_suspended",
      },
      {
        id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
        firstName: "Jenny",
        type: "customer_updated",
      },
    ]);
  });
});
