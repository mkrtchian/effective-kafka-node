import { KafkaPublisherMock } from "../../adapters/out/KafkaPublisherMock.js";
import { CreateInitialValues } from "./CreateInitialValues.js";

describe("Create initial values", () => {
  it("publishes 10 initial events in the stage 1 topic", async () => {
    // Given
    const kafkaPublisherMock = new KafkaPublisherMock();
    const sut = new CreateInitialValues(kafkaPublisherMock);

    // When
    await sut.handle();

    // Then
    kafkaPublisherMock.shouldHavePublishedNumberOfMessages(10);
  });
});
