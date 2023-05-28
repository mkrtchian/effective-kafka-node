import { CreateInitialValuesPort } from "../../core/ports/in/CreateInitialValuesPort.js";
import { CreateInitialValues } from "../../core/services/CreateInitialValues.js";
import { KafkaPublisher } from "../out/KafkaPublisher.js";

export class CreateInitialValuesCLI {
  constructor(private readonly _service: CreateInitialValuesPort) {}

  async handle() {
    await this._service.handle();
  }
}

const stage1ConsumerCLI = new CreateInitialValuesCLI(
  new CreateInitialValues(new KafkaPublisher())
);
await stage1ConsumerCLI.handle();
