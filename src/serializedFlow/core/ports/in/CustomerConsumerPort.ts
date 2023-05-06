import { CustomerEvent } from "../../services/customerEvents";

export interface CustomerConsumerPort {
  handle(): Promise<CustomerEvent[]>;
}
