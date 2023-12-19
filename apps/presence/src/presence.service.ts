import {
  InRedisMemoryUser,
  MicroservicesEnum,
  RedisService,
} from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PresenceService {
  constructor(
    private readonly redis: RedisService,
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
  ) {}

  getActiveUser(id: string) {
    return this.redis.get(`user ${id}`);
  }

  async getUserFriends(userId: string) {
    const checkObserver = this.authService.send(
      { cmd: 'get-friends' },
      { userId },
    );

    return await firstValueFrom(checkObserver).catch((error) =>
      console.log(error),
    );
  }

  async getActiveFriends(id: string) {
    const friends: InRedisMemoryUser[] = await this.getUserFriends(id);
    const activeFriends = [];

    for (const friend of friends) {
      const activeFriend: InRedisMemoryUser = await (this.redis.get(
        `user ${friend.id}`,
      ) as Promise<InRedisMemoryUser>);
      if (activeFriend && activeFriend.isActive)
        activeFriends.push(activeFriend);
    }

    return activeFriends;
  }
}
