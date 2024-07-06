import Mailgen from 'mailgen';
import { Service } from 'typedi';
import { appConfig } from '@base/config/app';
import { IMailTemplate } from '@base/infrastructure/services/mail/interfaces/IMailTemplate';
import { MailTemplateBase } from '@base/infrastructure/services/mail/templates/abstracts/MailTemplateBase';

@Service()
export class ForgotPasswordTemplate extends MailTemplateBase implements IMailTemplate {
  private readonly username: string;
  private readonly token: string;

  constructor(username: string, token: string) {
    super();
    this.username = username;
    this.token = token;
  }

  public getTemplate(): Mailgen.Content {
    return {
      body: {
        name: this.username,
        intro: 'You have received this email because a password reset request for your account was received.',
        action: {
          instructions: 'Click the button below to reset your password:',
          button: {
            color: '#DC4D2F',
            text: 'Reset your password',
            link: `${appConfig.url}/reset-password?token=${this.token}`,
          },
        },
        outro: 'If you did not request a password reset, no further action is required on your part.',
      },
    };
  }
}
