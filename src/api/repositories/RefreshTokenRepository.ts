import moment from 'moment';
import { LessThan } from 'typeorm';
import { RefreshToken } from '@api/entities/RefreshToken';
import dataSource from '@base/database/data-source';
import { RefreshTokenInvalidException } from '@api/exceptions/Auth/RefreshToken/RefreshTokenInvalidException';
import { RefreshTokenExpiredException } from '@api/exceptions/Auth/RefreshToken/RefreshTokenExpiredException';

function checkRefreshTokenIsValid(refreshToken: RefreshToken) {
  if (!refreshToken) {
    throw new RefreshTokenInvalidException();
  }

  if (refreshToken.expireTime < moment().toDate()) {
    throw new RefreshTokenExpiredException();
  }
}

function findOneOrFail(options: any) {
  const refreshToken = this.findOne(options);
  checkRefreshTokenIsValid(refreshToken);
  return refreshToken;
}

export const RefreshTokenRepository = dataSource.getRepository(RefreshToken).extend({
  findExpiredRefreshTokens() {
    const currentDate = moment().toDate();
    return this.find({
      where: {
        expireTime: LessThan(currentDate),
      },
    });
  },
});
