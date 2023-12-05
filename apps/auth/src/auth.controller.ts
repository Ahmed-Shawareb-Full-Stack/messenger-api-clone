import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterDTO, SharedService } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  register(@Ctx() context: RmqContext, @Payload() data: RegisterDTO) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(data);
  }
}
