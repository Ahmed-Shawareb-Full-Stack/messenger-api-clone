import { Controller, UseGuards } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { AuthGuard, SharedService } from '@app/shared';

@Controller('users')
export class UsersController {
  constructor(private readonly SharedService: SharedService) {}

  @MessagePattern({ cmd: 'get-user' })
  getUser(@Ctx() context: RmqContext) {
    this.SharedService.acknowledgeMessage(context);
    return { user: 'USER' };
  }
}
