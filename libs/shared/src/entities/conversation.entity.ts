import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { UsersToConversations } from './user-conversation.entity';

@Entity({
  name: 'conversations',
})
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  users: User[];

  // @OneToMany(
  //   () => UsersToConversations,
  //   (usersToConversations) => usersToConversations.conversation,
  // )
  // usersToConversations: UsersToConversations[];
}
