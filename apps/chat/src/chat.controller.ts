import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RedisService, SharedService } from '@app/shared';

@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'start-conversation' })
  async startConversation(
    @Ctx() context: RmqContext,
    @Payload() data: { friendId: string; userId: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.chatService.startConversation(data.userId, data.friendId);
  }
}
