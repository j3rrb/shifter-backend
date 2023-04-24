import { Controller, Post } from '@nestjs/common';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CurrentUser } from 'src/decorators/current_user.dto';
import UserEntity from '@modules/user/entities/user.entity';

@Controller('log')
export default class LogController {
  constructor(@InjectQueue('log') private readonly logQueue: Queue) {}

  @Post()
  async create(@CurrentUser() user: UserEntity) {
    await this.logQueue.add('create', user.id);
  }
}
