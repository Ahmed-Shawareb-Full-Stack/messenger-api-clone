export interface InRedisMemoryUser {
  id: string;
  socketId: string;
  isActive: boolean;
}

export interface InRedisMemoryConversationUser {
  userId: string;
  socketId: string;
}
