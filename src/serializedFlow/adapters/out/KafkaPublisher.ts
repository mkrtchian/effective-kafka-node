import { StreamingPublisherPort } from "../../core/ports/out/StreamingPublisherPort.js";
import { CustomerEvent } from "../../core/services/customerEvents.js";
import { Producer as KafkaProducer, Kafka } from "kafkajs";

export class KafkaPublisher implements StreamingPublisherPort {
  private _connected: boolean;
  private _producer: KafkaProducer;

  constructor() {
    this._connected = false;
    const kafka = new Kafka({
      brokers: ["localhost:9092"],
    });
    this._producer = kafka.producer({ idempotent: true });
  }

  async publish(topicName: string, data: CustomerEvent) {
    await this.connect();
    const metadata = await this._producer.send({
      topic: topicName,
      messages: [
        {
          key: data.type,
          headers: { type: data.type },
          value: JSON.stringify(data),
        },
      ],
    });
    return metadata;
  }

  async connect() {
    if (this._connected) return;
    await this._producer.connect();
    this._connected = true;
  }

  async disconnect() {
    if (!this._connected) return;
    await this._producer.disconnect();
    this._connected = false;
  }
}
