import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestController } from './friend_request.controller';
import { FriendRequestService } from './friend_request.service';

describe('FriendRequestController', () => {
  let friendRequestController: FriendRequestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestController],
      providers: [FriendRequestService],
    }).compile();

    friendRequestController = app.get<FriendRequestController>(FriendRequestController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(friendRequestController.getHello()).toBe('Hello World!');
    });
  });
});
