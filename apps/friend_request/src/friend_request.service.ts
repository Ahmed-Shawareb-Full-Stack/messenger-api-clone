import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendRequestService {
  getHello(): string {
    return 'Hello World!';
  }
}
