import { Controller, Get } from '@nestjs/common';
import { PresenceService } from './presence.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FriendRequest, SharedService } from '@app/shared';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern({ cmd: 'get-active-user' })
  async getActiveUser(
    @Ctx() context: RmqContext,
    @Payload() data: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return await this.presenceService.getActiveUser(data.id);
  }

  @MessagePattern({ cmd: 'get-active-friends' })
  async getActiveFriends(
    @Ctx() context: RmqContext,
    @Payload() data: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return await this.presenceService.getActiveFriends(data.id);
  }

  @MessagePattern({ cmd: 'notify-user-new-friend-request' })
  async notifyUserWithNewFriendRequest(
    @Ctx() context: RmqContext,
    @Payload() data: FriendRequest,
  ) {
    this.sharedService.acknowledgeMessage(context);
    console.log(data);
    this.eventEmitter.emit('friend-request.new', data);

    return 'data';
  }
}
