import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { Body, CurrentUser, JsonController, Param, Post, UseBefore } from 'routing-controllers';
import { AuthGuard } from '@base/infrastructure/middlewares/application/AuthGuard';
import { ApiResponse } from '@api/responses/ApiResponse';
import { VerifyRefreshTokenRequest } from '@api/requests/Auth/RefreshToken/VerifyRefreshTokenRequest';
import { LoginService } from '@api/services/Auth/LoginService';
import { LoginEmailRequest } from '@api/requests/Auth/Login/LoginEmailRequest';
import { CurrentUserType } from '@api/types/CurrentUser';
import { SendEmailOtpCodeRequest } from '@api/requests/Auth/OtpCode/Send/SendEmailOtpCodeRequest';
import { SendSmsOtpCodeRequest } from '@api/requests/Auth/OtpCode/Send/SendSmsOtpCodeRequest';
import { VerifyEmailOtpCodeRequest } from '@api/requests/Auth/OtpCode/Verify/VerifyEmailOtpCodeRequest';
import { VerifySmsOtpCodeRequest } from '@api/requests/Auth/OtpCode/Verify/VerifySmsOtpCodeRequest';
import { ControllerBase } from '@api/controllers/Abstracts/ControllerBase';

@Service()
@OpenAPI({ tags: ['Auth'], description: 'Auth Controller' })
@JsonController('/auth')
export class LoginController extends ControllerBase {
  public constructor(private loginService: LoginService) {
    super();
  }

  @Post('/login')
  public async login(@Body() loginRequest: LoginEmailRequest) {
    const tokenPair = await this.loginService.loginCredentials(loginRequest);
    return ApiResponse.success('Login successful').setData(tokenPair);
  }

  @Post('/login/otp/send/email')
  public async sendEmailOtpCode(@Body() emailOtpSendRequest: SendEmailOtpCodeRequest) {
    await this.loginService.sendEmailOtpCode(emailOtpSendRequest.email);
    return ApiResponse.success('Access code has been sent to your e-mail address.');
  }

  @Post('/login/otp/send/sms')
  public async sendSmsOtpCode(@Body() smsOtpSendRequest: SendSmsOtpCodeRequest) {
    await this.loginService.sendSmsOtpCode(smsOtpSendRequest.phone);
    return ApiResponse.success('Access code has been sent to your phone number.');
  }

  @Post('/login/otp/verify/email')
  public async verifyEmailOtpCode(@Body() emailOtpVerifyRequest: VerifyEmailOtpCodeRequest) {
    const tokenPair = await this.loginService.verifyEmailLogin(emailOtpVerifyRequest.email, emailOtpVerifyRequest.otpCode);
    return ApiResponse.success('Successfully logged in').setData(tokenPair);
  }

  @Post('/login/otp/verify/sms')
  public async verifySmsOtpCode(@Body() smsOtpVerifyRequest: VerifySmsOtpCodeRequest) {
    const tokenPair = await this.loginService.verifySmsLogin(smsOtpVerifyRequest.phone, smsOtpVerifyRequest.token);
    return ApiResponse.success('Successfully logged in').setData(tokenPair);
  }

  @Post('/login/otp/verify/refresh-token')
  public async verifyRefreshToken(@Body() refreshTokenVerifyRequest: VerifyRefreshTokenRequest) {
    const tokenPair = await this.loginService.verifyRefreshTokenLogin(refreshTokenVerifyRequest.token);
    return ApiResponse.success('Successfully logged in').setData(tokenPair);
  }

  @OpenAPI({ security: [{ bearerAuth: [] }] })
  @Post('/roles/:role_id([0-9]+)/change-role')
  @UseBefore(AuthGuard)
  public async changeCurrentUserRole(@CurrentUser() currentUser: CurrentUserType, @Param('role_id') roleId: number) {
    const tokenPair = await this.loginService.changeUserRole(roleId, currentUser);
    return ApiResponse.success('Successfully logged in').setData(tokenPair);
  }

  @OpenAPI({ security: [{ bearerAuth: [] }] })
  @Post('/logout')
  @UseBefore(AuthGuard)
  public async logout(@CurrentUser({ required: true }) currentUser: CurrentUserType) {
    await this.loginService.logout(currentUser);
    return ApiResponse.success('Session closed successfully');
  }
}
