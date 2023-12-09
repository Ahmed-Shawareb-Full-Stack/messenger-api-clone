import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequest } from './friend-request.entity';

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
}
