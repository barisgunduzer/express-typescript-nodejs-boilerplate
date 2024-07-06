import { Service } from 'typedi';
import { userOtpConfig } from '@base/config/otp';
import { CurrentUserType } from '@api/types/CurrentUser';
import { LoginService } from '@api/services/Auth/LoginService';
import { PasswordConfirmException } from '@api/exceptions/Auth/Password/PasswordConfirmException';
import { PasswordWrongException } from '@api/exceptions/Auth/Password/PasswordWrongException';
import { PasswordSameException } from '@api/exceptions/Auth/Password/PasswordSameException';
import { OtpCodeInvalidException } from '@api/exceptions/Auth/OtpCode/OtpCodeInvalidException';
import { OtpCodeExpiredException } from '@api/exceptions/Auth/OtpCode/OtpCodeExpiredException';
import { HashService } from '@base/infrastructure/services/hash/HashService';
import { assertPhone, generateOTP } from '@base/utils/string';
import { ForgotPasswordEmailOtpCodeRequest } from '@api/requests/Auth/Password/ForgotPasswordEmailOtpCodeRequest';
import { addSecondToMoment } from '@base/utils/date';
import { ForgotPasswordSmsOtpCodeRequest } from '@api/requests/Auth/Password/ForgotPasswordSmsOtpCodeRequest';
import { ChangePasswordRequest } from '@api/requests/Auth/Password/ChangePasswordRequest';
import { ResetPasswordRequest } from '@api/requests/Auth/Password/ResetPasswordRequest';
import { OtpCode } from '@api/entities/OtpCode';
import { OtpCodeTypeEnum } from '@api/enums/OtpCodeTypeEnum';
import { UserRepository } from '@api/repositories/UserRepository';
import { OtpCodeRepository } from '@api/repositories/OtpCodeRepository';
import { ForgotPasswordMailQueueJob } from '@api/jobs/queue/mail/ForgotPasswordMailQueueJob';
import { ForgotPasswordSmsQueueJob } from '@api/jobs/queue/mail/ForgotPasswordSmsQueueJob';

@Service()
export class PasswordService {
  constructor(
    private loginService: LoginService,
    private hashService: HashService,
  ) {}

  public async sendForgotPasswordEmailTokenToUser(forgotPasswordEmailRequest: ForgotPasswordEmailOtpCodeRequest): Promise<any> {
    const user = await UserRepository.findOne({ where: { email: forgotPasswordEmailRequest.email } });

    const otpCode = generateOTP(6);

    const content = `Your password renewal code: ${otpCode}`;

    await new ForgotPasswordMailQueueJob({ email: forgotPasswordEmailRequest.email, content }).dispatch();

    const forgotPasswordEmailTokenData: Partial<OtpCode> = {
      userId: user.id,
      token: otpCode,
      destination: forgotPasswordEmailRequest.email,
      otpCodeTypeId: OtpCodeTypeEnum.emailForgotOtpCode,
      expireTime: addSecondToMoment(userOtpConfig.emailOtpExpireIn),
    };

    await OtpCodeRepository.save(forgotPasswordEmailTokenData);
  }

  public async sendForgotPasswordSmsTokenToUser(forgotPasswordSmsTokenRequest: ForgotPasswordSmsOtpCodeRequest): Promise<any> {
    const user = await UserRepository.findOneOrFail({ where: { phone: assertPhone(forgotPasswordSmsTokenRequest.phone) } });

    const otpCode = generateOTP(6);

    const content = `Your password renewal code: ${otpCode}`;

    await new ForgotPasswordSmsQueueJob({ phone: forgotPasswordSmsTokenRequest.phone, content }).dispatch();

    const forgotPasswordSmsTokenData: Partial<OtpCode> = {
      userId: user.id,
      token: otpCode,
      destination: assertPhone(forgotPasswordSmsTokenRequest.phone),
      otpCodeTypeId: OtpCodeTypeEnum.smsForgotOtpCode,
      expireTime: addSecondToMoment(userOtpConfig.smsOtpExpireIn),
    };

    await OtpCodeRepository.save(forgotPasswordSmsTokenData);
  }

  public async changePassword(currentUser: CurrentUserType, changePasswordRequest: ChangePasswordRequest) {
    if (changePasswordRequest.newPassword !== changePasswordRequest.confirmPassword) {
      throw new PasswordConfirmException();
    }

    const user = await UserRepository.findOneOrFail({
      where: { id: currentUser.userId },
    });

    const isValidPassword = await this.hashService.compare(changePasswordRequest.oldPassword, user.password);

    if (!isValidPassword) {
      throw new PasswordWrongException();
    }

    const isOldPasswordSameWithNewPassword = await this.hashService.compare(changePasswordRequest.newPassword, user.password);

    if (isOldPasswordSameWithNewPassword) {
      throw new PasswordSameException();
    }

    user.password = await this.hashService.make(changePasswordRequest.newPassword);

    await UserRepository.save(user);
    await this.loginService.logout(currentUser);
  }

  public async resetPassword(resetPasswordRequest: ResetPasswordRequest) {
    if (resetPasswordRequest.newPassword !== resetPasswordRequest.confirmPassword) {
      throw new PasswordConfirmException();
    }

    const forgotPasswordToken = await OtpCodeRepository.findOne({
      where: {
        token: resetPasswordRequest.token,
        otpCodeTypeId: resetPasswordRequest.tokenTypeId,
      },
    });

    const isForgotPasswordTokenExpired = forgotPasswordToken.expireTime < new Date();

    const forgotPasswordException = !forgotPasswordToken
      ? new OtpCodeInvalidException()
      : isForgotPasswordTokenExpired
        ? new OtpCodeExpiredException()
        : null;

    if (forgotPasswordException) {
      throw forgotPasswordException;
    }

    const user = await UserRepository.findOneBy({ id: forgotPasswordToken.userId });

    user.password = await this.hashService.make(resetPasswordRequest.newPassword);

    await UserRepository.save(user);
    await OtpCodeRepository.remove(forgotPasswordToken);
  }
}
