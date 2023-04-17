import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
