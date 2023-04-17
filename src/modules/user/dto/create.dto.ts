import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
