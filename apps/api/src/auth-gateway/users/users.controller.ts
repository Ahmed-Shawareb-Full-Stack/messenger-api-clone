import {
  AuthGuard,
  MicroservicesEnum,
  UserInterceptor,
  UserRequest,
} from '@app/shared';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class UsersGateway {
  constructor(
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  // @UseGuards(AuthGuard)
  // @Get('get-user')
  // getUser(): any {
  //   return this.authService.send({ cmd: 'get-user' }, {});
  // }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('make-friend-request/:friendId')
  addFriend(@Req() request: UserRequest, @Param('friendId') friendId: string) {
    if (!request.user) return new BadRequestException('not a valid user');

    return this.authService.send(
      { cmd: 'make-friend-request' },
      { friendId, userId: request.user.id },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-received-friend-request')
  getUserReceivedFriends(@Req() request: UserRequest) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.authService.send(
      { cmd: 'get-received-friend-request' },
      { userId: request.user.id },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-created-friend-request')
  getUserCreatedFriends(@Req() request: UserRequest) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.authService.send(
      { cmd: 'get-created-friend-request' },
      { userId: request.user.id },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('accept-friend-request/:friendRequestId')
  acceptFriendRequest(
    @Req() request: UserRequest,
    @Param('friendRequestId') friendRequestId: string,
  ) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.authService.send(
      { cmd: 'accept-friend-request' },
      { userId: request.user.id, friendRequestId },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-friends')
  getFriends(@Req() request: UserRequest) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.authService.send(
      { cmd: 'get-friends' },
      { userId: request.user.id },
    );
  }
}
