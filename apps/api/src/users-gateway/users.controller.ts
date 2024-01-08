import {
  AuthGuard,
  MicroservicesEnum,
  UserInterceptor,
  UserRequest,
} from '@app/shared';
import {
  Controller,
  Get,
  Inject,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class UsersGateway {
  constructor(
    @Inject(MicroservicesEnum.USERS_SERVICE)
    private readonly usersService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('me')
  getUser(@Req() request: UserRequest): any {
    return request.user;
  }

  @UseGuards(AuthGuard)
  @Get('get-user-by-id/:userId')
  getUserById(@Param('userId') userId: string): any {
    console.log('first');
    return this.usersService.send({ cmd: 'get-user-by-id' }, { id: userId });
  }
}
