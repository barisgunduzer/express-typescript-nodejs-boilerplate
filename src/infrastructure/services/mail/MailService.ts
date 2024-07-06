import { mailConfig } from '@base/config/mail';
import { Service } from 'typedi';
import { SmtpProvider } from '@base/infrastructure/services/mail/providers/SmtpProvider';
import { IMailService } from '@base/infrastructure/services/mail/interfaces/IMailService';
import { SmsSendException } from '@base/infrastructure/services/sms/exceptions/SmsSendException';

@Service()
export class MailService implements IMailService {
  private provider: any;

  public constructor() {
    this.setProvider(mailConfig.provider);
  }

  public setProvider(provider: string) {
    switch (provider) {
      case 'smtp':
        this.provider = new SmtpProvider();
        break;

      default:
        break;
    }

    return this;
  }

  public from(value: string): this {
    return this.provider.from(value);
  }

  public to(value: string): this {
    return this.provider.to(value);
  }

  public subject(value: string): this {
    return this.provider.subject(value);
  }

  public text(value: string): this {
    return this.provider.text(value);
  }

  public html(value: string): this {
    return this.provider.html(value);
  }

  public async send(): Promise<any> {
    try {
      await this.provider.send();
    } catch (error) {
      throw new SmsSendException();
    }
  }

  public async sendWithoutErrorHandling(): Promise<any> {
    return this.provider.send();
  }
}
