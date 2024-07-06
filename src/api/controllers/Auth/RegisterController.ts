import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { Body, JsonController, Post } from 'routing-controllers';
import { ApiResponse } from '@api/responses/ApiResponse';
import { RegisterRequest } from '@api/requests/Auth/Register/RegisterRequest';
import { RegisterService } from '@api/services/Auth/RegisterService';
import { ControllerBase } from '@api/controllers/Abstracts/ControllerBase';

@Service()
@OpenAPI({ tags: ['Auth'], description: 'Auth Controller' })
@JsonController('/auth')
export class RegisterController extends ControllerBase {
  public constructor(private registerService: RegisterService) {
    super();
  }

  @Post('/register')
  public async login(@Body() registerRequest: RegisterRequest) {
    const tokenPair = await this.registerService.register(registerRequest);
    return ApiResponse.success('User registered successfully.').setData(tokenPair);
  }
}
