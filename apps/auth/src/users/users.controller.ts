import {
  ConflictException,
  Controller,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthGuard, SharedService } from '@app/shared';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly SharedService: SharedService,
    private readonly userService: UsersService,
  ) {}

  @MessagePattern({ cmd: 'get-user-by-id' })
  getUserById(@Ctx() context: RmqContext, @Payload() data: { id: string }) {
    this.SharedService.acknowledgeMessage(context);
    return this.userService.findUser(data);
  }
}
