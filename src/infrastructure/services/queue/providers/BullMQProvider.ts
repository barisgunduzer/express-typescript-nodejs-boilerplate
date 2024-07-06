import { IQueueProvider } from '@base/infrastructure/services/queue/interfaces/IQueueProvider';

export class BullMQProvider implements IQueueProvider {
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
}
