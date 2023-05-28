export interface Stage1ConsumerPort {
  handle(): Promise<void>;
}
