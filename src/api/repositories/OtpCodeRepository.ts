import moment from 'moment';
import dataSource from '@base/database/data-source';
import { OtpCode } from '@api/entities/OtpCode';
import { OtpCodeInvalidException } from '@api/exceptions/Auth/OtpCode/OtpCodeInvalidException';
import { OtpCodeExpiredException } from '@api/exceptions/Auth/OtpCode/OtpCodeExpiredException';

function checkIsValid(otpCode: OtpCode) {
  if (!otpCode) {
    throw new OtpCodeInvalidException();
  }

  if (otpCode.expireTime < moment().toDate()) {
    throw new OtpCodeExpiredException();
  }
}

const OtpCodeRepository = dataSource.getRepository(OtpCode).extend({
  findExpiredOtpCodes() {
    const currentDate = moment().toDate();
    checkIsValid(this);
    return this.createQueryBuilder('otp_codes').where('user_tokens.expireTime < :currentDate', { currentDate }).getMany();
  },
});

export { OtpCodeRepository };
