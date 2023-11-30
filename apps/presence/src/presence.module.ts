import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { SharedModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/shared/Database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    DatabaseModule,
    TypeOrmModule.forFeature(),
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
