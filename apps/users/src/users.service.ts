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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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
}
