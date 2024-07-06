import { env } from '@base/utils/env';

export const userOtpConfig = {
  smsOtpExpireIn: parseInt(env('SMS_OTP_EXPIRE', '120')), // seconds
  emailOtpExpireIn: parseInt(env('EMAIL_OTP_EXPIRE', '300')),
};
