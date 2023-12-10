import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FriendRequestStatusEnum } from '../types-and-dtos/friend-request.enum';

@Entity({
  name: 'FriendRequests',
})
@Unique(['creatorId', 'receiverId'])
@Unique(['receiverId', 'creatorId'])
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'uuid',
  })
  creatorId: string;

  @Column({
    type: 'uuid',
  })
  receiverId: string;

  @Column({
    type: 'enum',
    enum: FriendRequestStatusEnum,
    default: FriendRequestStatusEnum.PENDING,
  })
  status: FriendRequestStatusEnum;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.friendRequestCreator, {
    onDelete: 'CASCADE',
    eager: true,
  })
  creator: User;

  @ManyToOne(() => User, (user) => user.friendRequestCreator, {
    onDelete: 'CASCADE',
    eager: true,
  })
  receiver: User;
}
