import { IsEmail, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class ExistingUserDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(10)
  password!: string;

  role!: Role;
}
