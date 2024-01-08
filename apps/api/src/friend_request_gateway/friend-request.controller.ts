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
export class FriendRequestsGateway {
  constructor(
    @Inject(MicroservicesEnum.FRIEND_REQUEST_SERVICE)
    private readonly friendRequestService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('make-friend-request/:friendId')
  addFriend(@Req() request: UserRequest, @Param('friendId') friendId: string) {
    if (!request.user) return new BadRequestException('not a valid user');

    return this.friendRequestService.send(
      { cmd: 'make-friend-request' },
      { friendId, user: request.user },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-received-friend-request')
  getUserReceivedFriends(@Req() request: UserRequest) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.friendRequestService.send(
      { cmd: 'get-received-friend-request' },
      { userId: request.user.id },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-created-friend-request')
  getUserCreatedFriends(@Req() request: UserRequest) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.friendRequestService.send(
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
    return this.friendRequestService.send(
      { cmd: 'accept-friend-request' },
      { userId: request.user.id, friendRequestId },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-friends')
  getFriends(@Req() request: UserRequest) {
    if (!request.user) return new BadRequestException('not a valid user');
    return this.friendRequestService.send(
      { cmd: 'get-friends' },
      { userId: request.user.id },
    );
  }
}
