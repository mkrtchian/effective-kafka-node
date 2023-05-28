import {
  Stage1Message,
  StreamingConsumerPort,
} from "../../core/ports/out/StreamingConsumerPort.js";
import { Consumer, Kafka } from "kafkajs";

export class KafkaConsumer implements StreamingConsumerPort {
  private _connected: boolean;
  private _consumer: Consumer;

  constructor() {
    this._connected = false;
    const kafka = new Kafka({
      brokers: ["localhost:9092"],
    });
    this._consumer = kafka.consumer({ groupId: "serializedFlow" });
  }

  async runConsumer(callback: (message: Stage1Message) => void) {
    await this.connect();
    await this._consumer.run({
      autoCommit: false,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        commitOffsetsIfNecessary,
        uncommittedOffsets,
      }) => {
        for (const message of batch.messages) {
          callback(message);
          resolveOffset(message.offset);
          await heartbeat();
        }
        await commitOffsetsIfNecessary(uncommittedOffsets());
      },
    });
  }

  async subscribe(topicName: string, options: { fromBeginning: boolean }) {
    await this.connect();
    await this._consumer.subscribe({
      topic: topicName,
      fromBeginning: options.fromBeginning,
    });
  }

  async connect() {
    if (this._connected) return;
    await this._consumer.connect();
    this._connected = true;
  }

  async disconnect() {
    if (!this._connected) return;
    await this._consumer.disconnect();
    this._connected = false;
  }
}
