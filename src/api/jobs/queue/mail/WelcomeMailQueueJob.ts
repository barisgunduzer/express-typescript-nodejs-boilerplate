import { QueueJobBase } from '@base/infrastructure/services/queue/abstracts/QueueJobBase';
import { Job } from 'bullmq';
import { MailService } from '@base/infrastructure/services/mail/MailService';
import { Container } from 'typedi';
import { env } from '@base/utils/env';

export class WelcomeMailQueueJob extends QueueJobBase {
  constructor(data: any) {
    super(data);
  }

  public handle(job: Job) {
    const mailService = Container.get(MailService);

    mailService
      .subject(`Welcome to ${env('APP_NAME')}'!`)
      .to(this._data.email)
      .text(this._data.content)
      .sendWithoutErrorHandling();

    console.log(`job: ${job.name} is queued (jobId:${job.id})`);
  }

  public onCompleted(job: any): any {
    console.log(`job: ${job.name} is finished (jobId:${job.id})`);
  }

  public onFailed(job: any): any {
    console.log(`job: ${job.name} is failed (jobId:${job.id})`);
  }
}
