import { Stage1ConsumerPort } from "../../core/ports/in/Stage1Port.js";
import { Stage1Consumer } from "../../core/services/Stage1Consumer.js";
import { KafkaConsumer } from "../out/KafkaConsumer.js";
import { KafkaPublisher } from "../out/KafkaPublisher.js";
import { Logger } from "../out/Logger.js";

export class Stage1ConsumerCLI {
  constructor(private readonly _service: Stage1ConsumerPort) {}

  async handle() {
    await this._service.handle();
  }
}

const stage1ConsumerCLI = new Stage1ConsumerCLI(
  new Stage1Consumer(new KafkaConsumer(), new KafkaPublisher(), new Logger())
);
await stage1ConsumerCLI.handle();
