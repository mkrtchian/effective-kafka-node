import { kafka } from "./kafka.js";
import { delay } from "../utils.js";
import { TOPIC_NAME } from "./constants.js";

const producer = kafka.producer({ idempotent: true });
await producer.connect();

for (let i = 0; i < 10; i++) {
  const metadata = await producer.send({
    topic: TOPIC_NAME,
    messages: [{ key: "test-key", value: "Hello KafkaJS user!" }],
  });
  console.log("Published record to offset ", metadata[0].baseOffset);
  await delay(800);
}

await producer.disconnect();
