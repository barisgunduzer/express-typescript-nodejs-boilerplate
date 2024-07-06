import { Body, CurrentUser, JsonController, Post, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { ApiResponse } from '@api/responses/ApiResponse';
import { PasswordService } from '@api/services/Auth/PasswordService';
import { ForgotPasswordEmailOtpCodeRequest } from '@api/requests/Auth/Password/ForgotPasswordEmailOtpCodeRequest';
import { ForgotPasswordSmsOtpCodeRequest } from '@api/requests/Auth/Password/ForgotPasswordSmsOtpCodeRequest';
import { AuthGuard } from '@base/infrastructure/middlewares/application/AuthGuard';
import { ChangePasswordRequest } from '@api/requests/Auth/Password/ChangePasswordRequest';
import { ResetPasswordRequest } from '@api/requests/Auth/Password/ResetPasswordRequest';
import { CurrentUserType } from '@api/types/CurrentUser';
import { ControllerBase } from '@api/controllers/Abstracts/ControllerBase';

@Service()
@OpenAPI({ tags: ['Auth'], description: 'Auth Controller' })
@JsonController('/auth')
export class PasswordController extends ControllerBase {
  public constructor(private passwordService: PasswordService) {
    super();
  }

  @OpenAPI({ security: [{ bearerAuth: [] }] })
  @Post('/change-password')
  @UseBefore(AuthGuard)
  public async changePassword(@CurrentUser({ required: true }) currentUser: CurrentUserType, @Body() changePasswordRequest: ChangePasswordRequest) {
    await this.passwordService.changePassword(currentUser, changePasswordRequest);
    return ApiResponse.success('Password changed successfully.');
  }

  @Post('/reset-password')
  public async resetPassword(@Body() resetPasswordRequest: ResetPasswordRequest) {
    await this.passwordService.resetPassword(resetPasswordRequest);
    return ApiResponse.success('Password changed successfully.');
  }

  @Post('/forgot-password/send-email-token')
  public async forgotPasswordEmailToken(@Body() forgotPasswordEmailRequest: ForgotPasswordEmailOtpCodeRequest) {
    await this.passwordService.sendForgotPasswordEmailTokenToUser(forgotPasswordEmailRequest);
    return ApiResponse.success('Password reset code has been sent to your e-mail address.');
  }

  @Post('/forgot-password/send-sms-token')
  public async forgotPasswordSmsToken(@Body() forgotPasswordSmsRequest: ForgotPasswordSmsOtpCodeRequest) {
    await this.passwordService.sendForgotPasswordSmsTokenToUser(forgotPasswordSmsRequest);
    return ApiResponse.success('Password reset code has been sent to your phone number.');
  }
}
