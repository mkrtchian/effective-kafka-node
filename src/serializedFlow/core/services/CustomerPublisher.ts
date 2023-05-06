import { customerTopicName } from "../../constants.js";
import { CustomerPublisherPort } from "../ports/in/CustomerPublisherPort.js";
import { LoggerPort } from "../ports/out/LoggerPort.js";
import { SleeperPort } from "../ports/out/SleeperPort.js";
import { StreamingPublisherPort } from "../ports/out/StreamingPublisherPort.js";
import { CustomerEvent } from "./customerEvents.js";

export class CustomerPublisher implements CustomerPublisherPort {
  constructor(
    private readonly _streamingPublisher: StreamingPublisherPort,
    private readonly _sleeper: SleeperPort,
    private readonly _logger: LoggerPort
  ) {}

  async handle() {
    const customersEvents: CustomerEvent[] = [
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
    ];

    for (const customerEvent of customersEvents) {
      const metadata = await this._streamingPublisher.publish(
        customerTopicName,
        customerEvent
      );
      this._logger.log("Published record to offset ", metadata[0].baseOffset);
      await this._sleeper.sleep(800);
    }

    await this._streamingPublisher.disconnect();
  }
}
