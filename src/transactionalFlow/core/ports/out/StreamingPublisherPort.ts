import { Stage1Event, Stage2Event } from "../../services/events.js";

type Metadata = {
  baseOffset?: string;
}[];

export interface StreamingPublisherPort {
  publish(
    topicName: string,
    data: Stage1Event | Stage2Event
  ): Promise<Metadata>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
