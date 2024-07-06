import { Cron, CronController as CronJobClass } from 'cron-decorators';
import { Service as Injectable } from 'typedi';
import { RefreshTokenRepository } from '@api/repositories/RefreshTokenRepository';

@Injectable()
@CronJobClass()
export class OtpCronJob {
  @Cron('Remove expired tokens', '*/5 * * * *', {
    runOnInit: true,
    timeZone: 'Europe/Istanbul',
  })
  public async handle(): Promise<void> {
    const expiredRefreshTokens = await RefreshTokenRepository.findExpiredRefreshTokens();
    await RefreshTokenRepository.remove(expiredRefreshTokens);
  }
}
