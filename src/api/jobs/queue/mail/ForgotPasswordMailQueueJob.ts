import { QueueJobBase } from '@base/infrastructure/services/queue/abstracts/QueueJobBase';
import { Job } from 'bullmq';
import { MailService } from '@base/infrastructure/services/mail/MailService';
import { Container } from 'typedi';
import { appConfig } from '@base/config/app';

export class ForgotPasswordMailQueueJob extends QueueJobBase {
  constructor(data: any) {
    super(data);
  }

  public async handle(job: Job) {
    const mailService = Container.get(MailService);

    mailService
      .subject(`${appConfig.appName} - Renew My Password`)
      .to(this._data.email)
      .text(this._data.content)
      .sendWithoutErrorHandling()

    console.log(`job: ${job.name} is queued (jobId:${job.id})`);
  }

  public onCompleted(job: any): any {
    console.log(`job: ${job.name} is finished (jobId:${job.id})`);
  }

  public onFailed(job: any): any {
    console.log(`job: ${job.name} is failed (jobId:${job.id})`);
  }
}
