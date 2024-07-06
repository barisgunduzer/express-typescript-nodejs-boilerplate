import { QueueJobBase } from '@base/infrastructure/services/queue/abstracts/QueueJobBase';
import { Job } from 'bullmq';

export class OtpCodeSmsQueueJob extends QueueJobBase {
  public async handle(job: Job) {
    console.log(`job: ${job.name} is queued (jobId:${job.id})`);
  }

  public onCompleted(job: any): any {
    console.log(`job: ${job.name} is finished (jobId:${job.id})`);
  }

  public onFailed(job: any): any {
    console.log(`job: ${job.name} is failed (jobId:${job.id})`);
  }
}
