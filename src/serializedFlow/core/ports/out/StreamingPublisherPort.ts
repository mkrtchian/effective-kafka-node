import { CustomerEvent } from "../../services/customerEvents.js";

type Metadata = {
  baseOffset?: string;
}[];

export interface StreamingPublisherPort {
  publish(topicName: string, data: CustomerEvent): Promise<Metadata>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
