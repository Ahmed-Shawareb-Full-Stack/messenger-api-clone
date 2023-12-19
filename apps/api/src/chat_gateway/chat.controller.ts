import {
  AuthGuard,
  MicroservicesEnum,
  RabbitMQ_Queues,
  UserInterceptor,
  UserRequest,
} from '@app/shared';
import {
  Controller,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class ChatGateway {
  constructor(
    @Inject(MicroservicesEnum.CHAT_SERVICE)
    private readonly chatService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('start-conversation/:friendId')
  startConversation(
    @Req() request: UserRequest,
    @Param('friendId') friendId: string,
  ) {
    const ob$ = this.chatService.send(
      { cmd: 'start-conversation' },
      { userId: request.user.id, friendId },
    );

    return ob$;
  }
}
