import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LogEntity from './entities/log.entity';
import LogService from './log.service';
import LogController from './log.controller';
import UserModule from '@modules/user/user.module';
import UserEntity from '@modules/user/entities/user.entity';
import { BullModule } from '@nestjs/bull';
import LogProcessor from './log.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogEntity, UserEntity]),
    BullModule.registerQueue({
      name: 'log',
    }),
    UserModule,
  ],
  providers: [LogService, LogProcessor],
  controllers: [LogController],
})
export default class LogModule {}
