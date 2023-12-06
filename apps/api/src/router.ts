import { AppModule } from './app.module';
import { AuthGatewayModule } from './auth-gateway/auth.module';
import { UsersGatewayModule } from './auth-gateway/users/users.module';

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
    ],
  },
];
