import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FriendRequest, SharedModule, User } from '@app/shared';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendRequest]), SharedModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
