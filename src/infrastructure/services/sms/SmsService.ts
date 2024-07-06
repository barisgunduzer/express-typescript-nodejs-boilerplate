import { ISmsService } from '@base/infrastructure/services/sms/interfaces/ISmsService';
import { SmsSendException } from '@base/infrastructure/services/sms/exceptions/SmsSendException';
import { Service } from 'typedi';
import { ISmsProvider } from '@base/infrastructure/services/sms/interfaces/ISmsProvider';
import { assertPhone } from '@base/utils/string';
import { smsConfig } from '@base/config/sms';

@Service()
export class SmsService implements ISmsService {
  private provider: ISmsProvider;

  public constructor() {
    this.setProvider(smsConfig.provider);
  }

  public setProvider(provider: string) {
    switch (provider) {
      case 'example-sms-provider':
        // this.provider = new ExampleSmsProvider();
        break;
      default:
        break;
    }

    return this;
  }

  async send(numbers: string[] | string, content: string): Promise<void> {
    if (typeof numbers === 'string') {
      numbers = assertPhone(numbers);
    } else {
      numbers = numbers.map((x) => assertPhone(x));
    }
    try {
      await this.provider.send(numbers, content);
    } catch (error) {
      throw new SmsSendException();
    }
  }

  async sendWithoutException(numbers: string[] | string, content: string) {
    try {
      await this.send(numbers, content);
    } catch (e) {
      // ignore
    }
  }
}
