import { Controller, Get } from '@nestjs/common';
import { PresenceService } from './presence.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
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
}
