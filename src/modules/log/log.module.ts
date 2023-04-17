import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LogEntity from './entities/log.entity';
import LogService from './log.service';
import LogController from './log.controller';
import UserModule from '@modules/user/user.module';
import UserEntity from '@modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity, UserEntity]), UserModule],
  providers: [LogService],
  controllers: [LogController],
})
export default class LogModule {}
