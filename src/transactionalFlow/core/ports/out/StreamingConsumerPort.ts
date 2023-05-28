export interface Stage1Message {
  offset: string;
  value: Buffer | null;
  headers?: Record<string, unknown>;
}

export interface StreamingConsumerPort {
  subscribe(
    topicName: string,
    options: { fromBeginning: boolean }
  ): Promise<void>;
  runConsumer(
    callback: (message: Stage1Message) => Promise<void>
  ): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
