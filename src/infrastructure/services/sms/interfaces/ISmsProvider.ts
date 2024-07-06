export interface ISmsProvider {
  send(numbers: string[] | string, content: string): Promise<void>;
}
