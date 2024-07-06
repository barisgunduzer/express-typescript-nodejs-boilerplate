export interface IMailTemplate {
  getTemplate(): object;
  getHtmlContent(): string;
}
