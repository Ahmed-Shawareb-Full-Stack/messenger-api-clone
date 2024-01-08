import { FriendRequest, MicroservicesEnum, User } from '@app/shared';
import { FriendRequestStatusEnum } from '@app/shared/types-and-dtos/friend-request.enum';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @Inject(MicroservicesEnum.PRESENCE_SERVICE)
    private readonly presenceService: ClientProxy,
    @Inject(MicroservicesEnum.USERS_SERVICE)
    private readonly usersService: ClientProxy,
  ) {}

  async addFriendRequest(creator: User, receiverId: string) {
    if (creator.id == receiverId)
      return new ConflictException(
        'friend request can not be to and from the same user',
      );

    const creatorId = creator.id;
    const friendRequest = this.friendRequestRepo.create({
      creatorId,
      receiverId,
    });

    const newFriendRequest = (await this.friendRequestRepo.save(
      friendRequest,
    )) as FriendRequest & { friend: User };

    newFriendRequest.friend = creator;

    const ob$ = this.presenceService.send(
      { cmd: 'notify-user-new-friend-request' },
      newFriendRequest,
    );

    const ob$2 = this.usersService.send(
      { cmd: 'get-user-by-id' },
      { id: newFriendRequest.creatorId },
    );

    const asd = await firstValueFrom(ob$).catch((error) => console.log(error));

    delete newFriendRequest.friend;

    return newFriendRequest;
  }

  async getFriends(userId: string) {
    const acceptedFriendRequest = await this.friendRequestRepo.find({
      where: [
        {
          status: FriendRequestStatusEnum.ACCEPTED,
          creatorId: userId,
        },
        {
          status: FriendRequestStatusEnum.ACCEPTED,
          receiverId: userId,
        },
      ],
      relations: ['receiver', 'creator'],
      order: {
        createdAt: 'DESC',
      },
    });
    const friends = acceptedFriendRequest.map((request) => {
      if (request.receiverId == userId) {
        return request.creator;
      } else {
        return request.receiver;
      }
    });
    return friends;
  }

  async checkFriendShip(userId: string, friendId: string) {
    const acceptedFriendRequest = await this.friendRequestRepo.findOne({
      where: [
        {
          status: FriendRequestStatusEnum.ACCEPTED,
          creatorId: userId,
          receiverId: friendId,
        },
        {
          status: FriendRequestStatusEnum.ACCEPTED,
          creatorId: friendId,
          receiverId: userId,
        },
      ],
    });

    return !!acceptedFriendRequest;
  }

  async acceptFriendRequest(friendRequestId: any, userId: string) {
    console.log(friendRequestId, userId);
    const friendRequest = await this.friendRequestRepo.findOne({
      where: {
        id: friendRequestId,
        receiverId: userId,
      },
    });

    if (!friendRequest)
      return new BadRequestException('wrong friend request or user');

    return this.friendRequestRepo.save({
      id: friendRequestId,
      status: FriendRequestStatusEnum.ACCEPTED,
    });
  }

  getUserCreatedFriendRequest(userId: string) {
    return this.friendRequestRepo.find({
      where: {
        creatorId: userId,
        status: FriendRequestStatusEnum.PENDING,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getUserReceivedFriendRequest(userId: string) {
    return this.friendRequestRepo.find({
      where: {
        receiverId: userId,
        status: FriendRequestStatusEnum.PENDING,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getPreviousFriendRequest(friend1Id: string, friend2Id: string) {
    return this.friendRequestRepo.find({
      where: [
        { creatorId: friend1Id, receiverId: friend2Id },
        { creatorId: friend2Id, receiverId: friend1Id },
      ],
    });
  }
}
