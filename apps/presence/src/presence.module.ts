import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import {
  MicroservicesEnum,
  RabbitMQ_Queues,
  RedisModule,
  SharedModule,
} from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { PresenceWebSocketGateway } from './presence.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    SharedModule.registerRmq(
      MicroservicesEnum.USERS_SERVICE,
      RabbitMQ_Queues.RABBITMQ_USERS_QUEUE,
    ),
    SharedModule.registerRmq(
      MicroservicesEnum.FRIEND_REQUEST_SERVICE,
      RabbitMQ_Queues.RABBITMQ_FRIEND_REQUEST_QUEUE,
    ),
    DatabaseModule,
    RedisModule,
    TypeOrmModule.forFeature(),
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceWebSocketGateway],
})
export class PresenceModule {}
