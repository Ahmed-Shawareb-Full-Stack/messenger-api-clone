import {
  ConflictException,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService, User } from '@app/shared';
import { FriendRequestService } from './friend_request.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class FriendRequestController {
  constructor(
    private readonly SharedService: SharedService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  @MessagePattern({ cmd: 'check-friend-request-existence' })
  async checkPreviousFriendRequest(
    @Ctx() context: RmqContext,
    @Payload() data: { friendId: string; userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);

    const previousFriendRequests =
      await this.friendRequestService.getPreviousFriendRequest(
        data.userId,
        data.friendId,
      );

    return previousFriendRequests;
  }

  @MessagePattern({ cmd: 'make-friend-request' })
  async addFriend(
    @Ctx() context: RmqContext,
    @Payload() data: { friendId: string; user: User },
  ) {
    try {
      this.SharedService.acknowledgeMessage(context);

      const previousFriendRequests =
        await this.friendRequestService.getPreviousFriendRequest(
          data.user.id,
          data.friendId,
        );

      if (previousFriendRequests && previousFriendRequests.length) {
        return new ConflictException('there is actually a friend request');
      }

      const friendRequest = await this.friendRequestService.addFriendRequest(
        data.user,
        data.friendId,
      );

      return friendRequest;
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
    return await this.friendRequestService.getFriends(data.userId);
  }

  @MessagePattern({ cmd: 'check-friendship' })
  async checkFriendShip(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: string; friendId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.friendRequestService.checkFriendShip(
      data.userId,
      data.friendId,
    );
  }

  @MessagePattern({ cmd: 'get-created-friend-request' })
  async getUserCreatedFriendsRequest(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.friendRequestService.getUserCreatedFriendRequest(
      data.userId,
    );
  }

  @MessagePattern({ cmd: 'get-received-friend-request' })
  async getUserReceivedFriendsRequest(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.friendRequestService.getUserReceivedFriendRequest(
      data.userId,
    );
  }

  @MessagePattern({ cmd: 'accept-friend-request' })
  async acceptFriendRequest(
    @Ctx() context: RmqContext,
    @Payload() data: { friendRequestId: string; userId: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return await this.friendRequestService.acceptFriendRequest(
      data.friendRequestId,
      data.userId,
    );
  }
}
