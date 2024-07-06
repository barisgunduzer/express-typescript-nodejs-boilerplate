import { OtpCodeTypeEnum } from '@api/enums/OtpCodeTypeEnum';

export const otpCodeTypeDataSet = [
  {
    id: OtpCodeTypeEnum.smsLoginOtpCode,
    name: 'SMS Login',
  },
  {
    id: OtpCodeTypeEnum.smsForgotOtpCode,
    name: 'SMS Forgot Password',
  },
  {
    id: OtpCodeTypeEnum.emailLoginOtpCode,
    name: 'Email Login',
  },
  {
    id: OtpCodeTypeEnum.emailForgotOtpCode,
    name: 'Email Forgot Password',
  },
];
