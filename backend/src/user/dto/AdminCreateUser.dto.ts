import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class AdminCreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(10)
  password!: string;

  @IsNotEmpty()
  role!: Role;
}
