import { CustomerPublisherPort } from "../../core/ports/in/CustomerPublisherPort.js";
import { CustomerPublisher } from "../../core/services/CustomerPublisher.js";
import { KafkaPublisher } from "../out/KafkaPublisher.js";
import { Logger } from "../out/Logger.js";
import { Sleeper } from "../out/Sleeper.js";

export class CustomerPublisherCLI {
  constructor(private readonly _service: CustomerPublisherPort) {}

  async handle() {
    await this._service.handle();
  }
}

const customerPublisherCLI = new CustomerPublisherCLI(
  new CustomerPublisher(new KafkaPublisher(), new Sleeper(), new Logger())
);
await customerPublisherCLI.handle();
