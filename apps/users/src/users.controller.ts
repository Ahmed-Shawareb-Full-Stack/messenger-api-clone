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
import { CreateUserDTO, SharedService, User } from '@app/shared';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly SharedService: SharedService,
    private readonly userService: UsersService,
  ) {}

  @MessagePattern({ cmd: 'create-user' })
  createUser(@Ctx() context: RmqContext, @Payload() data: CreateUserDTO) {
    this.SharedService.acknowledgeMessage(context);
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'get-user-by-id' })
  getUserById(@Ctx() context: RmqContext, @Payload() data: { id: string }) {
    this.SharedService.acknowledgeMessage(context);
    return this.userService.findUser(data);
  }

  @MessagePattern({ cmd: 'find-user-by-email' })
  findUserByEmail(
    @Ctx() context: RmqContext,
    @Payload() data: { email: string },
  ) {
    this.SharedService.acknowledgeMessage(context);
    return this.userService.findUserByEmail(data.email);
  }

  @MessagePattern({ cmd: 'find-user' })
  findUser(@Ctx() context: RmqContext, @Payload() data: Partial<User>) {
    this.SharedService.acknowledgeMessage(context);
    return this.userService.findUser(data);
  }
}
