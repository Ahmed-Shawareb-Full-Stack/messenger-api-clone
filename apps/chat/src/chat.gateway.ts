import {
  AuthData,
  InRedisMemoryConversationUser,
  InRedisMemoryUser,
  Message,
  MessageState,
  MicroservicesEnum,
  NewMessageDTO,
  RedisService,
  User,
} from '@app/shared';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
    private readonly redis: RedisService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const jwtToken = socket.handshake.headers.authorization ?? null;

    if (!jwtToken) this.handleDisconnect(socket);

    const authObserve = this.authService.send(
      { cmd: 'verify-jwt' },
      { jwtToken },
    );

    const jwtPayload: AuthData = await firstValueFrom(authObserve).catch(
      (error) => console.log(error),
    );

    if (!jwtPayload) this.handleDisconnect(socket);

    if (!jwtPayload.user && !jwtPayload.user.id) this.handleDisconnect(socket);

    socket.data.user = jwtPayload.user;

    console.log('Start chat connection', socket.data);

    await this.setConversationUserInMemory(socket);
  }

  async handleDisconnect(socket: Socket) {
    console.log('chat disconnect', socket.id);
  }

  private async setConversationUserInMemory(socket: Socket) {
    const user = socket.data.user;

    if (!user || !user.id) return;

    const conversationUser = { userId: user.id, socketId: socket.id };

    await this.redis.set(`conversationUser ${user.id}`, conversationUser);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() message: NewMessageDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketUser: User = socket.data.user;
    console.log('user sending', socketUser);
    if (!socketUser || !socketUser.id) return;

    const currentConversation = await this.chatService.getConversation(
      socketUser.id,
      message.friendId,
    );

    if (!currentConversation) return;

    const newMessage = await this.chatService.createMessage(
      message,
      socketUser.id,
    );

    const conversationFriend: InRedisMemoryConversationUser =
      await (this.redis.get(
        `conversationUser ${message.friendId}`,
      ) as Promise<InRedisMemoryConversationUser>);

    if (!conversationFriend) return;

    this.server
      .to(conversationFriend.socketId)
      .emit(
        'newMessage',
        newMessage,
        async (error, ack: [{ received: Message }]) => {
          console.log(ack);
          if (ack && ack.length && ack[0].received.id) {
            await this.chatService.updateMessageState(
              ack[0].received.id,
              MessageState.RECEIVED,
            );
          }
        },
      );
    // await this.setConversationUserInMemory(socket);
  }
}
