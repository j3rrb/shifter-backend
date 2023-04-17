import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import CreateUserDTO from './dto/create.dto';
import AuthEntity from '@modules/auth/entities/auth.entity';
import { generatePassword } from 'src/utils/password';

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

      return createdUser;
    } catch (error) {
      this.logger.error(`Create user: ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async getById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id,
    });

    return user;
  }
}
