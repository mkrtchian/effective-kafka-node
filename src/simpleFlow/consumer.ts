import { kafka } from "./kafka.js";
import { GROUP_ID, TOPIC_NAME } from "./constants.js";

const consumer = kafka.consumer({ groupId: GROUP_ID });

await consumer.connect();
await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

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
