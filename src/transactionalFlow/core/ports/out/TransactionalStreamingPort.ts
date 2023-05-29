import { Stage1Event, Stage2Event } from "../../services/events";
import { Stage1Message } from "./StreamingConsumerPort";
import { Metadata } from "./StreamingPublisherPort";

export interface TransactionalStreamingPort {
  subscribe(
    topicName: string,
    options: { fromBeginning: boolean }
  ): Promise<void>;
  runConsumer(
    callback: (message: Stage1Message) => Promise<void>
  ): Promise<void>;
  publish(
    topicName: string,
    data: Stage1Event | Stage2Event
  ): Promise<Metadata>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export { Stage1Event, Stage2Event, Stage1Message, Metadata };
