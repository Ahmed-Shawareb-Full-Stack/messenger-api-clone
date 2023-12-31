import { AppModule } from './app.module';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { PresenceGatewayModule } from './presence-gateway/presence.module';
import { ChatGatewayModule } from './chat_gateway/chat.module';
import { FriendRequestsGatewayModule } from './friend_request_gateway/friend-request.module';
import { UsersGatewayModule } from './users-gateway/users.module';

export const router = [
  {
    path: '',
    module: AppModule,
    children: [
      {
        path: 'auth',
        module: AuthGatewayModule,
      },
      {
        path: 'presence',
        module: PresenceGatewayModule,
      },
      {
        path: 'chat',
        module: ChatGatewayModule,
      },
      {
        path: 'users',
        module: UsersGatewayModule,
      },
      {
        path: 'friend-requests',
        module: FriendRequestsGatewayModule,
      },
    ],
  },
];
