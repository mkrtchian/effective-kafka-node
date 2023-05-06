import type { IHeaders, KafkaMessage } from "kafkajs";
import { kafka } from "./kafka.js";
import { GROUP_ID, TOPIC_NAME } from "./constants.js";
import {
  CustomerEvent,
  customerCreatedSchema,
  customerEventTypeSchema,
  customerReinstatedSchema,
  customerSuspendedSchema,
  customerUpdatedSchema,
} from "./customerEvents.js";

const consumer = kafka.consumer({ groupId: GROUP_ID });

await consumer.connect();
await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

const customerEvents: CustomerEvent[] = [];

await consumer.run({
  autoCommit: false,
  eachBatch: async ({
    batch,
    resolveOffset,
    heartbeat,
    commitOffsetsIfNecessary,
    uncommittedOffsets,
  }) => {
    for (const message of batch.messages) {
      handleMessage(message);
      resolveOffset(message.offset);
      await heartbeat();
    }
    await commitOffsetsIfNecessary(uncommittedOffsets());
  },
});

function handleMessage(message: KafkaMessage) {
  const type = parseHeaders(message.headers);
  const customerEvent = parseMessage(message.value, type);
  customerEvents.push(customerEvent);
  console.log("New event received ", customerEvent);
}

function parseHeaders(headers: IHeaders | undefined) {
  return customerEventTypeSchema.parse(headers?.type?.toString());
}

function parseMessage(value: Buffer | null, type: CustomerEvent["type"]) {
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
