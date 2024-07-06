import moment from 'moment';
import crypto from 'crypto';
import { Service } from 'typedi';
import { CacheService } from '@base/infrastructure/services/cache/CacheService';
import { HashService } from '@base/infrastructure/services/hash/HashService';
import { User } from '@api/entities/User';
import { addSecondToMoment } from '@base/utils/date';
import { InvalidCredentialsException } from '@api/exceptions/Auth/InvalidCredentialsException';
import { authConfig } from '@base/config/auth';
import { assertPhone, generateOTP, randomNumber } from '@base/utils/string';
import { CacheHashKeyEnum } from '@api/enums/CacheHashKeyEnum';
import { userOtpConfig } from '@base/config/otp';
import { RefreshToken } from '@api/entities/RefreshToken';
import { OtpCode } from '@api/entities/OtpCode';
import { OtpCodeTypeEnum } from '@api/enums/OtpCodeTypeEnum';
import { RoleNotDefinedException } from '@api/exceptions/Role/RoleNotDefinedException';
import { RoleCannotSameException } from '@api/exceptions/Role/RoleCannotSameException';
import { RolePassiveException } from '@api/exceptions/Role/RolePassiveException';
import { LoginEmailRequest } from '@api/requests/Auth/Login/LoginEmailRequest';
import { UserRepository } from '@api/repositories/UserRepository';
import { RefreshTokenRepository } from '@api/repositories/RefreshTokenRepository';
import { OtpCodeRepository } from '@api/repositories/OtpCodeRepository';
import { TokenService } from '@base/infrastructure/services/token/TokenService';
import { CurrentUserType } from '@api/types/CurrentUser';
import { AccessTokenType } from '@api/types/AccessToken';
import { CurrentUser } from 'routing-controllers';
import { Role } from '@api/entities/Role';
import { DeepPartial } from 'typeorm';
import { OtpCodeMailQueueJob } from '@api/jobs/queue/mail/OtpCodeMailQueueJob';
import { OtpCodeSmsQueueJob } from '@api/jobs/queue/sms/OtpCodeSmsQueueJob';
import { env } from '@base/utils/env';
import { RoleType } from '@api/types/Role';
import { appConfig } from '@base/config/app';

@Service()
export class LoginService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
  ) {}

  public async loginCredentials(loginRequest: LoginEmailRequest) {
    const user = await UserRepository.findOneOrFail({
      where: { email: loginRequest.email },
      relations: ['roles', 'roles.organization'],
    });

    const isPasswordTrue = await this.hashService.compare(loginRequest.password, user.password);

    if (!isPasswordTrue) {
      throw new InvalidCredentialsException();
    }

    const existsRefreshToken = await RefreshTokenRepository.findOne({ where: { userId: user.id } });

    if (existsRefreshToken) {
      await RefreshTokenRepository.remove(existsRefreshToken);
    }

    return await this._createTokenPair(user, user.roles[0]);
  }

  public async sendEmailOtpCode(email: string) {
    const user = await UserRepository.findOneOrFail({ where: { email } });

    const subject = `${appConfig.appName} - Verify Confirmation Code`;

    const otpCode = generateOTP(6);

    const content = `Verification Code: ${otpCode}`;

    await new OtpCodeMailQueueJob({ email, subject, content }).setOptions({ delay: 0 }).dispatch();

    const userTokenData: Partial<OtpCode> = {
      userId: user.id,
      token: otpCode,
      destination: email,
      otpCodeTypeId: OtpCodeTypeEnum.emailLoginOtpCode,
      expireTime: addSecondToMoment(userOtpConfig.emailOtpExpireIn),
    };

    await OtpCodeRepository.save(userTokenData);

    return true;
  }

  public async sendSmsOtpCode(phone: string) {
    const phoneNumber = assertPhone(phone);

    const user = await UserRepository.findOneOrFail({ where: { phone: assertPhone(phone) } });

    const otpCode = randomNumber(6);

    const content = `Verification code: ${otpCode}`;

    await new OtpCodeSmsQueueJob({ phoneNumber, content }).setOptions({ delay: 0 }).dispatch();

    const userTokenData: DeepPartial<OtpCode> = {
      userId: user.id,
      token: otpCode,
      destination: phoneNumber,
      otpCodeTypeId: OtpCodeTypeEnum.smsLoginOtpCode,
      expireTime: addSecondToMoment(userOtpConfig.emailOtpExpireIn),
    };

    await OtpCodeRepository.save(userTokenData);

    return true;
  }

  public async verifyEmailLogin(email: string, token: string) {
    const user = await UserRepository.findOneOrFail({
      where: { email },
      relations: ['roles', 'roles.organization'],
    });

    return await this._verifyOtpTokenAndGetSignedTokenPair(user, token, OtpCodeTypeEnum.emailLoginOtpCode);
  }

  public async verifySmsLogin(phone: string, token: string) {
    const phoneNumber = assertPhone(phone);

    const user = await UserRepository.findOneOrFail({
      select: ['id', 'phone'],
      where: { phone: phoneNumber },
      relations: ['roles', 'roles.organization'],
    });

    return await this._verifyOtpTokenAndGetSignedTokenPair(user, token, OtpCodeTypeEnum.smsLoginOtpCode);
  }

  // The refresh token is deleted after verification and then a new access-refresh token pair is sent.
  public async verifyRefreshTokenLogin(token: string) {
    const refreshToken = await RefreshTokenRepository.findOneOrFail({ where: { token } });

    await RefreshTokenRepository.remove(refreshToken);

    const user = await UserRepository.findOneBy({ id: refreshToken.userId });

    return await this._createTokenPair(user);
  }

  public async changeUserRole(roleId: number, currentUser: CurrentUserType) {
    const user = await UserRepository.findOneOrFail({
      where: { id: currentUser.userId },
      relations: ['roles', 'roles.organization'],
    });

    const newUserRole = user.roles.find((role) => role.id === roleId);

    if (!newUserRole) {
      throw new RoleNotDefinedException();
    }

    if (newUserRole.isActive === false) {
      throw new RolePassiveException();
    }

    if (newUserRole.id === currentUser.activeRole.id) {
      throw new RoleCannotSameException();
    }

    const refreshToken = await RefreshTokenRepository.findOne({
      where: { userId: currentUser.userId },
    });

    await RefreshTokenRepository.remove(refreshToken);

    await this.cacheService
      .manager()
      .deleteHashCache(CacheHashKeyEnum.sessionUser, `${env('APP_NAME')}_${currentUser.userId}_${currentUser.activeRole.id}`);

    const tokenPair = await this._createTokenPair(user, newUserRole);

    await this.cacheService
      .manager()
      .setHashCache(CacheHashKeyEnum.sessionUser, `${env('APP_NAME')}_${user.id}_${newUserRole.id}`, tokenPair.accessToken);

    return tokenPair;
  }

  // In logout logic, the token is invalidated by removing it from the cache.
  public async logout(@CurrentUser({ required: true }) currentUser: CurrentUserType) {
    await this.cacheService
      .manager()
      .deleteHashCache(CacheHashKeyEnum.sessionUser, `${env('APP_NAME')}_${currentUser.userId}_${currentUser.activeRole.id}`);

    const refreshToken = await RefreshTokenRepository.findOne({
      where: { userId: currentUser.userId },
    });

    if (refreshToken) {
      await RefreshTokenRepository.remove(refreshToken);
    }

    return true;
  }

  private async _verifyOtpTokenAndGetSignedTokenPair(user: User, token: string, tokenType: OtpCodeTypeEnum) {
    const otpToken = await OtpCodeRepository.findOneOrFail({
      where: { otpCodeTypeId: tokenType, token },
    });

    const refreshToken = await RefreshTokenRepository.findOne({ where: { userId: user.id } });

    // Remove the old refresh token in the database if it has been logged in before.
    if (refreshToken) {
      await RefreshTokenRepository.remove(refreshToken);
    }

    await OtpCodeRepository.remove(otpToken);

    return await this._createTokenPair(user);
  }

  private async _createTokenPair(user: User, newActiveRole?: Role) {
    const getHighestRoleId = () => Math.min(...user.roles.map(role => role.id));
    const activeRole = newActiveRole ?? user.roles.filter((role) => role.id === getHighestRoleId()).at(0);
    const activeRoleType: RoleType = {id: activeRole.id, name: activeRole.name};

    const token = crypto
      .createHash('sha256')
      .update(Date.now() + Math.random().toString())
      .digest('hex');

    const refreshTokenData: Partial<RefreshToken> = {
      userId: user.id,
      roleId: activeRole.id,
      token: token,
      expireTime: moment().add(authConfig.providers.refreshToken.expiresIn, 'hours').toDate(),
    };

    const refreshToken = RefreshTokenRepository.create(refreshTokenData);

    await RefreshTokenRepository.save(refreshToken);

    const accessTokenPayload: AccessTokenType = {
      userId: user.id,
      userName: user.userName,
      organizationId: activeRole.organizationId ?? null,
      activeRole: activeRoleType
    };

    const tokenPair = this.tokenService.sign(accessTokenPayload, token);

    await this.cacheService
      .manager()
      .setHashCache(CacheHashKeyEnum.sessionUser, `${env('APP_NAME')}_${user.id}_${activeRole.id}`, tokenPair.accessToken);

    return tokenPair;
  }
}
