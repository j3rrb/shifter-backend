import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LogEntity from './entities/log.entity';
import LogService from './log.service';
import LogController from './log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [LogService],
  controllers: [LogController],
})
export default class LogModule {}
