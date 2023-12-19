import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendRequest } from './friend-request.entity';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { UsersToConversations } from './user-conversation.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  firstName: string;

  @Column({
    type: 'varchar',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.creator)
  friendRequestCreator: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  friendRequestReceiver: FriendRequest[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  // @OneToMany(
  //   () => UsersToConversations,
  //   (usersToConversations) => usersToConversations.user,
  // )
  // usersToConversations: UsersToConversations[];

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];
}
