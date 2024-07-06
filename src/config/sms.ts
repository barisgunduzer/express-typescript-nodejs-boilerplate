import { env } from '@base/utils/env';

export const smsConfig = {
  provider: env('SMS_PROVIDER'),
  host: env('SMS_HOST'),
  authUser: env('SMS_USER'),
  authPassword: env('SMS_PASSWORD'),
  senderTitle: env('SMS_SENDER_TITLE', `${env('APP_NAME')}`),
};
