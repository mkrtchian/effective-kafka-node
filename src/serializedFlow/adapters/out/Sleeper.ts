import { delay } from "../../../utils.js";
import { SleeperPort } from "../../core/ports/out/SleeperPort.js";

export class Sleeper implements SleeperPort {
  async sleep(ms: number) {
    await delay(ms);
  }
}
