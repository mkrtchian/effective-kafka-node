import { kafka } from "./kafka.js";

const consumer = kafka.consumer({ groupId: "test-group" });

await consumer.connect();
await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

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
      console.log({
        topic: batch.topic,
        partition: batch.partition,
        highWatermark: batch.highWatermark,
        message: {
          offset: message.offset,
          key: message.key?.toString(),
          value: message.value?.toString(),
          headers: message.headers,
        },
      });
      resolveOffset(message.offset);
      await heartbeat();
    }
    await commitOffsetsIfNecessary(uncommittedOffsets());
  },
});
