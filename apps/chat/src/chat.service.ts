import {
  Conversation,
  InRedisMemoryUser,
  Message,
  MessageState,
  MicroservicesEnum,
  NewMessageDTO,
  User,
} from '@app/shared';
import { UsersToConversations } from '@app/shared/entities/user-conversation.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    // @InjectRepository(UsersToConversations)
    // private readonly usersToConversationsRepo: Repository<UsersToConversations>,
    @Inject(MicroservicesEnum.AUTH_SERVICE)
    private readonly authService: ClientProxy,
    @Inject(MicroservicesEnum.PRESENCE_SERVICE)
    private readonly presenceService: ClientProxy,
  ) {}

  getConversation(userId: string, friendId: string) {
    const conversation = this.conversationRepo
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'users')
      .where('users.id = :userId', { userId })
      .orWhere('users.id = :friendId', { friendId })
      .having('Count(*) >= 2')
      .groupBy('conversation.id')
      .getOne();

    return conversation;
  }

  async getUserById(id: string) {
    const userObserver = this.authService.send(
      { cmd: 'get-user-by-id' },
      { id },
    );

    const user: User = await firstValueFrom(userObserver).catch((error) =>
      console.log(error),
    );

    return user;
  }

  async getUserActiveFriend(id: string) {
    const userObserver = this.presenceService.send(
      { cmd: 'get-active-user' },
      { id },
    );

    const user: InRedisMemoryUser = await firstValueFrom(userObserver).catch(
      (error) => console.log(error),
    );

    return user;
  }

  async checkFriendship(userId: string, friendId: string) {
    const checkObserver = this.authService.send(
      { cmd: 'check-friendship' },
      { userId, friendId },
    );

    const isFriend = await firstValueFrom(checkObserver).catch((error) =>
      console.log(error),
    );

    return isFriend;
  }

  async startConversation(userId: string, friendId: string) {
    const user = await this.getUserById(userId);
    const friend = await this.getUserById(friendId);
    // const activeFriend = await this.getUserActiveFriend(friendId);
    const isFriend = await this.checkFriendship(userId, friendId);

    if (!isFriend) {
      return new UnauthorizedException(
        'you should be friends to start a conversation',
      );
    }

    const havePreviousConversation = await this.getConversation(
      userId,
      friendId,
    );

    if (!!havePreviousConversation) {
      return havePreviousConversation;
    }

    let conversation = new Conversation();
    conversation.users = [user, friend];

    conversation = await this.conversationRepo.save(conversation);

    return conversation;
  }

  async getUserConversations(userId: string) {
    const user = await this.getUserById(userId);

    if (!user) {
      return new NotFoundException('user not found');
    }

    const conversations = await this.conversationRepo.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          id: userId,
        },
      },
    });

    return conversations;
  }

  async createMessage(message: NewMessageDTO, userId: string) {
    const user = this.getUserById(userId);

    if (!user) {
      return new NotFoundException('user not found');
    }

    const conversation = await this.conversationRepo.findOne({
      where: {
        id: message.conversationId,
      },
    });

    if (!conversation) {
      return new NotFoundException('conversation not found');
    }

    const newMessage = await this.messageRepo.save({
      content: message.content,
      conversationId: message.conversationId,
      userId,
      state: MessageState.SENT,
    });

    return newMessage;
  }

  updateMessageState(messageId: string, messageState: MessageState) {
    return this.messageRepo.save({
      id: messageId,
      state: messageState,
    });
  }
}
