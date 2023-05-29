import {
  Consumer,
  Kafka,
  OffsetsByTopicPartition,
  Producer,
  RecordMetadata,
  Transaction,
} from "kafkajs";
import {
  Stage1Message,
  Stage2Event,
  TransactionalStreamingPort,
} from "../../core/ports/out/TransactionalStreamingPort.js";
import { groupId } from "../../constants.js";

export class TransactionalKafka implements TransactionalStreamingPort {
  private _connected: boolean;
  private _consumer: Consumer;
  private _producer: Producer;
  private _uncommittedOffsets: OffsetsByTopicPartition;

  constructor() {
    this._connected = false;
    const kafka = new Kafka({
      brokers: ["localhost:9092"],
    });
    this._consumer = kafka.consumer({ groupId });
    this._producer = kafka.producer({
      transactionalId: "my-transactional-producer",
      maxInFlightRequests: 1,
      idempotent: true,
    });
    this._uncommittedOffsets = { topics: [] };
  }

  async runConsumer(callback: (message: Stage1Message) => Promise<void>) {
    await this.connect();
    await this._consumer.run({
      autoCommit: false,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        uncommittedOffsets,
      }) => {
        for (const message of batch.messages) {
          await callback(message);
          resolveOffset(message.offset);
          this._uncommittedOffsets = uncommittedOffsets();
          await heartbeat();
        }
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

  async publish(topicName: string, data: Stage2Event) {
    await this.connect();
    const transaction = await this._producer.transaction();
    let metadata: RecordMetadata[] = [];
    try {
      metadata = await this._sendEvent(topicName, data);
      await this._sendOffsets(transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.abort();
    }
    return metadata;
  }

  private async _sendEvent(topicName: string, data: Stage2Event) {
    return this._producer.send({
      topic: topicName,
      messages: [
        {
          headers: {},
          value: JSON.stringify(data),
        },
      ],
    });
  }

  private async _sendOffsets(transaction: Transaction) {
    await transaction.sendOffsets({
      consumerGroupId: groupId,
      topics: this._uncommittedOffsets.topics,
    });
  }

  async connect() {
    if (this._connected) return;
    await this._consumer.connect();
    await this._producer.connect();
    this._connected = true;
  }

  async disconnect() {
    if (!this._connected) return;
    // It seems that disconnecting the consumer is preventing it from receiving messages
    // await this._consumer.disconnect();
    await this._producer.disconnect();
    this._connected = false;
  }
}
