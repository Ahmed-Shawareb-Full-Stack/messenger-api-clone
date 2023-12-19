import { IsString, IsUUID } from 'class-validator';

export class NewMessageDTO {
  @IsString()
  content: string;

  @IsUUID(4)
  conversationId: string;

  @IsUUID(4)
  friendId: string;
}
