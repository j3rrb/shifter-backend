import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import CreateUserDTO from './dto/create.dto';
import AuthEntity from '@modules/auth/entities/auth.entity';
import { generatePassword } from 'src/utils/password';
import LogEntity from '@modules/log/entities/log.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly datasource: DataSource,
  ) {}

  logger = new Logger(UserService.name);

  async create(data: CreateUserDTO) {
    const { name, password, username } = data;
    const queryRunner = await this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const exists = await this.userRepository.findOneBy({
        username,
      });

      if (exists) {
        throw new HttpException(
          { message: 'User already exists' },
          HttpStatus.CONFLICT,
        );
      }

      const { hash, salt } = await generatePassword(password);

      const auth = await queryRunner.manager.save(AuthEntity, {
        hash,
        salt,
      });

      const createdUser = await queryRunner.manager.save(UserEntity, {
        name,
        username,
        auth,
      });

      await queryRunner.commitTransaction();

      delete createdUser.auth;

      return createdUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Create user: ${error.message}`);

      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async getById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        break: true,
        breakReturn: true,
        shiftEnd: true,
        shiftStart: true,
        logs: true,
      },
    });

    return user;
  }

  async associateLog(
    user: UserEntity,
    log: LogEntity,
    queryRunner: QueryRunner,
  ) {
    const { break: breakStart, breakReturn, shiftEnd, shiftStart, id } = user;

    const allLogged = shiftStart && breakStart && breakReturn && shiftEnd;
    const noneLogged = !shiftStart && !shiftEnd && !breakStart && !breakReturn;
    const shouldRestart = allLogged || noneLogged;

    try {
      user.logs = [...user.logs, log];

      await queryRunner.manager.save(user);

      if (shouldRestart) {
        await queryRunner.manager.update(
          UserEntity,
          { id },
          {
            shiftStart: log,
            break: null,
            breakReturn: null,
            shiftEnd: null,
          },
        );
      } else if (shiftStart && !breakStart && !breakReturn && !shiftEnd) {
        await queryRunner.manager.update(
          UserEntity,
          { id },
          {
            break: log,
          },
        );
      } else if (shiftStart && breakStart && !breakReturn && !shiftEnd) {
        await queryRunner.manager.update(
          UserEntity,
          { id },
          {
            breakReturn: log,
          },
        );
      } else if (shiftStart && breakStart && breakReturn && !shiftEnd) {
        await queryRunner.manager.update(
          UserEntity,
          { id },
          {
            shiftEnd: log,
          },
        );
      }
    } catch (error) {
      this.logger.error(`Associate log to user: ${error.message}`);

      throw new HttpException(
        {
          message: 'There was an error while associating the log to the user ',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLogs(userId: number, limit = 10, page = 1): Promise<LogEntity[]> {
    try {
      const user = await this.getById(userId);

      if (!user) {
        throw new HttpException(
          {
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const qb = this.userRepository.createQueryBuilder('u');

      const offset = (page - 1) * limit;

      const query = qb
        .select('l.*')
        .innerJoin('user_log', 'ul', 'ul."userId" = u.id')
        .innerJoin('log', 'l', 'l.id = ul."logId"')
        .where('u.id = :userId', { userId })
        .offset(offset)
        .limit(limit);

      const data = await query.getRawMany();

      return data;
    } catch (error) {
      this.logger.error(`Get logs error: ${error.message}`);

      if (error instanceof HttpException) {
        throw new HttpException(
          {
            message: error.message,
          },
          error.getStatus(),
        );
      }

      throw new InternalServerErrorException();
    }
  }
}
