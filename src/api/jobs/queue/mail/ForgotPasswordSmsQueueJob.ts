import { QueueJobBase } from '@base/infrastructure/services/queue/abstracts/QueueJobBase';
import { Job } from 'bullmq';
import { Container } from 'typedi';
import { SmsService } from '@base/infrastructure/services/sms/SmsService';

export class ForgotPasswordSmsQueueJob extends QueueJobBase {
  constructor(data: any) {
    super(data);
  }

  public async handle(job: Job) {
    const smsService = Container.get(SmsService);
    smsService.send(this._data.phone, this._data.content);
    console.log(`job: ${job.name} is queued (jobId:${job.id})`);
  }

  public onCompleted(job: any): any {
    console.log(`job: ${job.name} is finished (jobId:${job.id})`);
  }

  public onFailed(job: any): any {
    console.log(`job: ${job.name} is failed (jobId:${job.id})`);
  }
}
