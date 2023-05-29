import { CreateInitialValuesPort } from "../../core/ports/in/CreateInitialValuesPort.js";
import { CreateInitialValues } from "../../core/services/CreateInitialValues.js";
import { KafkaPublisher } from "../out/KafkaPublisher.js";
import { Logger } from "../out/Logger.js";

export class CreateInitialValuesCLI {
  constructor(private readonly _service: CreateInitialValuesPort) {}

  async handle() {
    await this._service.handle();
  }
}

const createInitialValuesCLI = new CreateInitialValuesCLI(
  new CreateInitialValues(new KafkaPublisher(), new Logger())
);
await createInitialValuesCLI.handle();
