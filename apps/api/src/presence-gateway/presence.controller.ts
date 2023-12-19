import {
  AuthGuard,
  MicroservicesEnum,
  UserInterceptor,
  UserRequest,
} from '@app/shared';
import {
  Controller,
  Get,
  Inject,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class PresenceGateway {
  constructor(
    @Inject(MicroservicesEnum.PRESENCE_SERVICE)
    private readonly presenceService: ClientProxy,
  ) {}
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('active-friends')
  getActiveFriends(@Req() request: UserRequest) {
    return this.presenceService.send(
      { cmd: 'get-active-friends' },
      {
        userId: request.user.id,
      },
    );
  }
}
