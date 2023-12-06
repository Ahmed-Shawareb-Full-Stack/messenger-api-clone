import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { router } from './router';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register(router),
    SharedModule.registerRmq('PRESENCE_SERVICE', 'RABBITMQ_PRESENCE_QUEUE'),
    AuthGatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
