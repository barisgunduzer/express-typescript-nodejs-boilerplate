import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { ApiResponse } from '@api/responses/ApiResponse';
import { UserService } from '@api/services/User/UserService';
import { UpdateUserRequest } from '@api/requests/User/UpdateUserRequest';
import { CreateUserRequest } from '@api/requests/User/CreateUserRequest';
import { ControllerBase } from '@api/controllers/Abstracts/ControllerBase';
import { CurrentUserType } from '@api/types/CurrentUser';
import { AuthGuard } from '@base/infrastructure/middlewares/application/AuthGuard';
import { RoleTypeEnum } from '@api/enums/RoleTypeEnum';

@Service()
@OpenAPI({
  tags: ['Users'],
  description: 'User Controller',
  security: [{ bearerAuth: [] }],
})
@JsonController('/users')
@UseBefore(AuthGuard)
export class UserController extends ControllerBase {
  public constructor(private userService: UserService) {
    super();
  }

  @Get()
  public async getAllUsers(@QueryParam('offset') offset: number = 0, @QueryParam('limit') limit: number = 10) {
    const users = await this.userService.getAllUsers({ skip: offset, take: limit });
    return ApiResponse.success().setData(users);
  }

  @Get('/:id([0-9]+)')
  @Authorized([RoleTypeEnum.SuperAdmin])
  public async getUser(@Param('id') userId: number, @CurrentUser() currentUser: CurrentUserType) {
    const user = await this.userService.getUserById(userId);
    return ApiResponse.success().setData(user);
  }

  @Put('/:id([0-9]+)')
  public async updateUser(@Param('id') userId: number, @Body() userUpdateRequest: UpdateUserRequest) {
    const updateResult = await this.userService.updateUserById(userId, userUpdateRequest);
    return ApiResponse.success().setData(updateResult);
  }

  @Post()
  public async createUser(@Body() userCreateRequest: CreateUserRequest) {
    const user = await this.userService.createUser(userCreateRequest);
    return ApiResponse.success().setData(user);
  }

  @Delete('/:id([0-9]+)')
  public async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUserById(id);
    return ApiResponse.success('User deleted successfully');
  }
}
