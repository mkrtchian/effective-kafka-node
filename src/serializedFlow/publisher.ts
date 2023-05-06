import { kafka } from "./kafka.js";
import { delay } from "../utils.js";
import { TOPIC_NAME } from "./constants.js";

const producer = kafka.producer({ idempotent: true });
await producer.connect();

const customersEvents = [
  {
    id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
    firstName: "John",
    lastName: "Doe",
    type: "customer_created",
  },
  {
    id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
    firstName: "Jane",
    lastName: "Doe",
    type: "customer_created",
  },
  {
    id: "c178993a-b3d2-4915-b63c-46f7b9f13267",
    type: "customer_suspended",
  },
  {
    id: "49fe76e3-89f1-4963-8ba9-87a0f08a4fa8",
    firstName: "Jenny",
    type: "customer_updated",
  },
];

for (const customerEvent of customersEvents) {
  const metadata = await producer.send({
    topic: TOPIC_NAME,
    messages: [
      {
        key: customerEvent.type,
        headers: { type: customerEvent.type },
        value: JSON.stringify(customerEvent),
      },
    ],
  });
  console.log("Published record to offset ", metadata[0].baseOffset);
  await delay(800);
}

await producer.disconnect();
