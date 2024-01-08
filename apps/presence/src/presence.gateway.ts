import {
  AuthData,
  FriendRequest,
  InRedisMemoryUser,
  MicroservicesEnum,
  RedisService,
} from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
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
import { Cache } from 'cache-manager';
import { Observable, firstValueFrom } from 'rxjs';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class PresenceWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
    @Inject(MicroservicesEnum.FRIEND_REQUEST_SERVICE)
    private readonly friendRequestService: ClientProxy,
    private readonly redis: RedisService,
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

    await this.setUserActiveState(socket, true);
  }

  async handleDisconnect(socket: Socket) {
    await this.setUserActiveState(socket, false);
  }

  private async setUserActiveState(socket: Socket, isActive: boolean) {
    const user = socket.data.user;
    if (!user) return;

    const inRedisMemoryUser: InRedisMemoryUser = {
      id: user.id,
      socketId: socket.id,
      isActive: isActive,
    };
    await this.redis.set(`user ${inRedisMemoryUser.id}`, inRedisMemoryUser, 0);
    this.emitUserStatusToFriends(inRedisMemoryUser);
  }

  private async getUserFriends(userId: string) {
    const authObserve = this.friendRequestService.send(
      { cmd: 'get-friends' },
      { userId },
    );

    const userFriends = await firstValueFrom(authObserve).catch((error) =>
      console.log(error),
    );

    if (!userFriends && !userFriends.length) return;

    return userFriends;
  }

  private async emitUserStatusToFriends(user: InRedisMemoryUser) {
    const userFriends = await this.getUserFriends(user.id);

    for (let friend of userFriends) {
      const friendInMemory = (await this.redis.get(
        `user ${friend.id}`,
      )) as InRedisMemoryUser;

      if (!friendInMemory) continue;

      this.server.to(friendInMemory.socketId).emit('friendStatus', user);
      if (user.isActive) {
        this.server.to(user.socketId).emit('userStatus', friendInMemory);
      }
    }
  }

  @SubscribeMessage('updateUserActiveState')
  updateUserActiveState(socket: Socket, data: { isActive: boolean }) {
    if (!socket.data.user) return;
    this.setUserActiveState(socket, data.isActive);
  }

  @OnEvent('friend-request.new')
  async emitNewFriendRequest(payload: FriendRequest) {
    delete payload.creatorId;
    console.log('<<<<<<<payload>>>>>>>', payload);
    const friendInMemory = (await this.redis.get(
      `user ${payload.receiverId}`,
    )) as InRedisMemoryUser;
    console.log('InRedisMemoryUser', friendInMemory);
    this.server.to(friendInMemory.socketId).emit('newFriendRequest', payload);
  }
}
