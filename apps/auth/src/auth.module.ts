import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MicroservicesEnum, RabbitMQ_Queues, SharedModule } from '@app/shared';
import { DatabaseModule } from '@app/shared';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './passport/jwt/jwt.guard';
import { JwtStrategy } from './passport/jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
    SharedModule.registerRmq(
      MicroservicesEnum.USERS_SERVICE,
      RabbitMQ_Queues.RABBITMQ_USERS_QUEUE,
    ),
    SharedModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, JwtStrategy],
})
export class AuthModule {}
