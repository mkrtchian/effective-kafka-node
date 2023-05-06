import { LoggerPort } from "../../core/ports/out/LoggerPort.js";

export class Logger implements LoggerPort {
  log(...messages: unknown[]) {
    console.log(...messages);
  }
}
