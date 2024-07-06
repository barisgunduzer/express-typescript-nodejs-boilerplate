import { Cron, CronController as CronJobClass } from 'cron-decorators';
import { Service as Injectable } from 'typedi';
import { OtpCodeRepository } from '@api/repositories/OtpCodeRepository';

@Injectable()
@CronJobClass()
export class OtpCodeCronJob {
  @Cron('Remove expired tokens', '*/5 * * * *', {
    runOnInit: true,
    timeZone: 'Europe/Istanbul',
  })
  public async handle(): Promise<void> {
    const expiredOtpCodes = await OtpCodeRepository.findExpiredOtpCodes();
    await OtpCodeRepository.remove(expiredOtpCodes);
  }
}
