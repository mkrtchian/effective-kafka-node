import { ComputeSquareValuesPort } from "../../core/ports/in/ComputeSquareValuesPort.js";
import { ComputeSquareValues } from "../../core/services/ComputeSquareValues.js";
import { Logger } from "../out/Logger.js";
import { TransactionalKafka } from "../out/TransactionalKafka.js";

export class ComputeSquareValuesCLI {
  constructor(private readonly _service: ComputeSquareValuesPort) {}

  async handle() {
    await this._service.handle();
  }
}

const computeSquareValuesCLI = new ComputeSquareValuesCLI(
  new ComputeSquareValues(new TransactionalKafka(), new Logger())
);
await computeSquareValuesCLI.handle();
