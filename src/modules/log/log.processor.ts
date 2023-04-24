import { Processor, Process } from '@nestjs/bull';
import LogService from './log.service';
import type { Job } from 'bull';

@Processor('log')
export default class LogProcessor {
  constructor(private readonly logService: LogService) {}

  @Process('create')
  async processCreateLog({ data }: Job) {
    await this.logService.create(data);
  }
}
