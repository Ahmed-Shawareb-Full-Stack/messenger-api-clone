import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO, FriendRequest, User } from '@app/shared';
import { FriendRequestStatusEnum } from '@app/shared/types-and-dtos/friend-request.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
  ) {}

  async createUser(data: CreateUserDTO) {
    try {
      const existingUser = await this.findUserByEmail(data.email);
      if (existingUser) {
        return new ConflictException('User already exists');
      }
      const user = await this.userRepo.save(data);
      delete user.password;
      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findUserByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName'],
    });
  }

  findUser(data: Partial<User>) {
    return this.userRepo.findOne({
      where: {
        ...data,
      },
    });
  }

  addFriendRequest(creatorId: string, receiverId: string) {
    if (creatorId == receiverId)
      return new ConflictException(
        'friend request can not be to and from the same user',
      );
    const friendRequest = this.friendRequestRepo.create({
      creatorId,
      receiverId,
    });
    return this.friendRequestRepo.save(friendRequest);
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
