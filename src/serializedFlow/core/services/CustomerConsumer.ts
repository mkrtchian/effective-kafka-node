import { customerTopicName } from "../../constants.js";
import {
  CustomerEvent,
  customerCreatedSchema,
  customerEventTypeSchema,
  customerReinstatedSchema,
  customerSuspendedSchema,
  customerUpdatedSchema,
} from "./customerEvents.js";
import { CustomerConsumerPort } from "../ports/in/CustomerConsumerPort.js";
import {
  CustomerMessage,
  CustomerMessageHeaders,
  StreamingConsumerPort,
} from "../ports/out/StreamingConsumerPort.js";
import { LoggerPort } from "../ports/out/LoggerPort.js";

export class CustomerConsumer implements CustomerConsumerPort {
  constructor(
    private readonly _streamingConsumer: StreamingConsumerPort,
    private readonly _logger: LoggerPort
  ) {}

  async handle() {
    await this._streamingConsumer.connect();
    await this._streamingConsumer.subscribe(customerTopicName, {
      fromBeginning: true,
    });

    const customerEvents: CustomerEvent[] = [];
    await this._streamingConsumer.runConsumer((message: CustomerMessage) =>
      this._handleMessage.bind(this)(message, customerEvents)
    );
    return customerEvents;
  }

  private _handleMessage(
    message: CustomerMessage,
    customerEvents: CustomerEvent[]
  ) {
    const type = this._parseHeaders(message.headers);
    const customerEvent = this._parseMessage(message.value, type);
    customerEvents.push(customerEvent);
    this._logger.log("New event received ", customerEvent);
  }

  private _parseHeaders(headers: CustomerMessageHeaders | undefined) {
    return customerEventTypeSchema.parse(headers?.type?.toString());
  }

  private _parseMessage(value: Buffer | null, type: CustomerEvent["type"]) {
    const unparsedCustomerEvent: unknown = JSON.parse(value?.toString() ?? "");
    switch (type) {
      case "customer_created":
        return customerCreatedSchema.parse(unparsedCustomerEvent);
      case "customer_updated":
        return customerUpdatedSchema.parse(unparsedCustomerEvent);
      case "customer_suspended":
        return customerSuspendedSchema.parse(unparsedCustomerEvent);
      case "customer_reinstated":
        return customerReinstatedSchema.parse(unparsedCustomerEvent);
    }
  }
}
