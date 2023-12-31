// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { User } from './user.entity';
// import { Conversation } from './conversation.entity';

// @Entity({
//   name: 'usersToConversations',
// })
// export class UsersToConversations {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({
//     type: 'uuid',
//   })
//   userId: string;

//   @Column({
//     type: 'uuid',
//   })
//   conversationId: string;

//   // @ManyToOne(() => User, (user) => user.usersToConversations)
//   // user: User;

//   // @ManyToOne(
//   //   () => Conversation,
//   //   (conversation) => conversation.usersToConversations,
//   // )
//   // conversation: Conversation;
// }
