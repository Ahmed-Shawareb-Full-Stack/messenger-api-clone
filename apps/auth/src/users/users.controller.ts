import {
  ConflictException,
  Controller,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthGuard, SharedService } from '@app/shared';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly SharedService: SharedService,
    private readonly userService: UsersService,
  ) {}

  @MessagePattern({ cmd: 'get-user' })
  getUser(@Ctx() context: RmqContext) {
    this.SharedService.acknowledgeMessage(context);
    return { user: 'USER' };
  }

  @MessagePattern({ cmd: 'make-friend-request' })
  async addFriend(
    @Ctx() context: RmqContext,
    @Payload() data: { friendId: string; userId: string },
  ) {
    try {
      this.SharedService.acknowledgeMessage(context);

      const previousFriendRequests =
        await this.userService.getPreviousFriendRequest(
          data.userId,
          data.friendId,
        );

      if (previousFriendRequests && previousFriendRequests.length) {
        return new ConflictException('you have already sent a friend request');
      }

      return await this.userService.addFriendRequest(
        data.userId,
        data.friendId,
      );
    } catch (error) {
      return new InternalServerErrorException(
        'some thing not good in the server happened',
      );
    }
  }

  @MessagePattern({ cmd: 'get-friends' })
  async getFriends(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.userService.getFriends(data.userId);
  }

  @MessagePattern({ cmd: 'get-created-friend-request' })
  async getUserReceivedFriends(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.userService.getUserCreatedFriendRequest(data.userId);
  }

  @MessagePattern({ cmd: 'get-received-friend-request' })
  async getUserCreatedFriends(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.userService.getUserReceivedFriendRequest(data.userId);
  }

  @MessagePattern({ cmd: 'accept-friend-request' })
  async acceptFriendRequest(
    @Ctx() context: RmqContext,
    @Payload() data: { friendRequestId: string; userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.userService.acceptFriendRequest(
      data.friendRequestId,
      data.userId,
    );
  }
}
