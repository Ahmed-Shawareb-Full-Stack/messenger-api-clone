import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'FriendRequests',
})
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user.friendRequestCreator, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @ManyToOne(() => User, (user) => user.friendRequestCreator, {
    onDelete: 'CASCADE',
  })
  receiver: User;
}
