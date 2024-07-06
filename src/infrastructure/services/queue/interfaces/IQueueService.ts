import { IQueueProvider } from '@base/infrastructure/services/queue/interfaces/IQueueProvider';

export interface IQueueService extends IQueueProvider {
  setProvider(provider: string): this;
}
