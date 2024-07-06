import { IQueueService } from '@base/infrastructure/services/queue/interfaces/IQueueService';

export class QueueService implements IQueueService {
  dispatch(): void {}

  handle(job: any): any {}

  onCompleted(job: any): any {}

  onFailed(job: any): any {}

  setJobName(jobName: string): this {
    return undefined;
  }

  setJobOptions(jobOptions: any): this {
    return undefined;
  }

  setProvider(provider: string): this {
    return undefined;
  }
}
