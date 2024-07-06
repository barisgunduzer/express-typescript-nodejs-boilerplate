import Mailgen from 'mailgen';
import { IMailTemplate } from '@base/infrastructure/services/mail/interfaces/IMailTemplate';
import { MailGenerator } from '../../MailGenerator';

export abstract class MailTemplateBase implements IMailTemplate {
  abstract getTemplate(): Mailgen.Content;

  public getHtmlContent() {
    return new MailGenerator().generateHtmlContent(this.getTemplate());
  }
}
