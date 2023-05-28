import { ComputeSquareValuesPort } from "../../core/ports/in/ComputeSquareValuesPort.js";
import { ComputeSquareValues } from "../../core/services/ComputeSquareValues.js";
import { KafkaConsumer } from "../out/KafkaConsumer.js";
import { KafkaPublisher } from "../out/KafkaPublisher.js";
import { Logger } from "../out/Logger.js";

export class ComputeSquareValuesCLI {
  constructor(private readonly _service: ComputeSquareValuesPort) {}

  async handle() {
    await this._service.handle();
  }
}

const stage1ConsumerCLI = new ComputeSquareValuesCLI(
  new ComputeSquareValues(
    new KafkaConsumer(),
    new KafkaPublisher(),
    new Logger()
  )
);
await stage1ConsumerCLI.handle();
