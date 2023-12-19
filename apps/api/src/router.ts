import { AppModule } from './app.module';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { UsersGatewayModule } from './auth-gateway/users/users.module';
import { PresenceGatewayModule } from './presence-gateway/presence.module';
import { ChatGatewayModule } from './chat_gateway/chat.module';

export const router = [
  {
    path: '',
    module: AppModule,
    children: [
      {
        path: 'auth',
        module: AuthGatewayModule,
        children: [
          {
            path: 'users',
            module: UsersGatewayModule,
          },
        ],
      },
      {
        path: 'presence',
        module: PresenceGatewayModule,
      },
      {
        path: 'chat',
        module: ChatGatewayModule,
      },
    ],
  },
];
