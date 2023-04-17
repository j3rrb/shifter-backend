import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import LoginDTO from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import AuthEntity from './entities/auth.entity';
import { hash } from 'bcrypt';
import { IUserJWT } from './auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly jwtService: JwtService,
  ) {}

  logger = new Logger(AuthService.name);

  async validateCredentials(data: LoginDTO) {
    const { password, username } = data;

    try {
      const user = await this.userRepository.findOne({
        where: {
          username,
        },
        relations: {
          auth: true,
        },
      });

      if (!user) {
        throw new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const authData = await this.authRepository.findOneBy({
        id: user.auth.id,
      });

      if (!authData) {
        throw new HttpException(
          { message: 'Auth data not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const compareHash = await hash(password, authData.salt);
      const isValid = compareHash === authData.hash;

      if (!isValid) {
        throw new HttpException(
          { message: 'Password does not match' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.authRepository.update(
        {
          id: authData.id,
        },
        {
          lastAccess: new Date().toISOString(),
        },
      );

      const jwtToken = await this.signJwt(user);

      return jwtToken;
    } catch (error) {
      this.logger.error(`Auth error: ${error.message}`);

      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }

      throw new InternalServerErrorException();
    }
  }

  async signJwt(user: UserEntity): Promise<string> {
    const token = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      username: user.username,
    });

    return token;
  }
}
