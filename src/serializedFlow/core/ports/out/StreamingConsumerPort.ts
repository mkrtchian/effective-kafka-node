export interface CustomerMessageHeaders {
  type?: string | Buffer;
}

export interface CustomerMessage {
  offset: string;
  value: Buffer | null;
  headers?: CustomerMessageHeaders;
}

export interface StreamingConsumerPort {
  subscribe(
    topicName: string,
    options: { fromBeginning: boolean }
  ): Promise<void>;
  runConsumer(callback: (message: CustomerMessage) => void): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
