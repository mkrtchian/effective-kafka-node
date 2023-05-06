import { CustomerConsumerPort } from "../../core/ports/in/CustomerConsumerPort.js";
import { CustomerConsumer } from "../../core/services/CustomerConsumer.js";
import { KafkaConsumer } from "../out/KafkaConsumer.js";
import { Logger } from "../out/Logger.js";

export class CustomerConsumerCLI {
  constructor(private readonly _service: CustomerConsumerPort) {}

  async handle() {
    await this._service.handle();
  }
}

const customerConsumerCLI = new CustomerConsumerCLI(
  new CustomerConsumer(new KafkaConsumer(), new Logger())
);
await customerConsumerCLI.handle();
