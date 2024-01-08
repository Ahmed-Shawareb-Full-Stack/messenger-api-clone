import { AuthData, MicroservicesEnum } from '@app/shared';
import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class FriendRequestWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
    // @Inject(MicroservicesEnum.FRIEND_REQUEST_SERVICE)
    // private readonly friendRequestService: ClientProxy,
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
  }

  async handleDisconnect(socket: Socket) {}
}
