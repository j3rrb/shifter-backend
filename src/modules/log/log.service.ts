import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import LogEntity from './entities/log.entity';
import { DataSource } from 'typeorm';
import UserService from '@modules/user/user.service';

@Injectable()
export default class LogService {
  constructor(
    private readonly userService: UserService,
    private readonly datasource: DataSource,
  ) {}

  logger = new Logger(LogService.name);

  async create(userId: number) {
    const queryRunner = await this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.userService.getById(userId);

      if (!user) {
        throw new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const createdLog = await queryRunner.manager.save(LogEntity, {});

      await this.userService.associateLog(user, createdLog as any, queryRunner);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }
    } finally {
      await queryRunner.release();
    }
  }
}
