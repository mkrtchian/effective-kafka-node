export interface SleeperPort {
  sleep(CustomerMessage: number): Promise<void>;
}
