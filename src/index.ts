import { Kafka } from "kafkajs";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({ idempotent: true });

await producer.connect();

for (let i = 0; i < 10; i++) {
  const metadata = await producer.send({
    topic: "test-topic",
    messages: [{ key: "test-key", value: "Hello KafkaJS user!" }],
  });
  console.log("Published record to offset ", metadata[0].baseOffset);
  await delay(800);
}

await producer.disconnect();
