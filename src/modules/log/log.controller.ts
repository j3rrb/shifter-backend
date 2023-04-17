import { Body, Controller, Post } from '@nestjs/common';
import LogService from './log.service';
import CreateUserLogDTO from './dtos/create.dto';

@Controller('log')
export default class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  async create(@Body() dto: CreateUserLogDTO) {
    await this.logService.create(dto);
  }
}
