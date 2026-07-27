import { IsEmail, IsNotEmpty, MinLength, IsUUID, IsEnum } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class UserDto {
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(10)
  password!: string;
}

export class UpdateUserDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}

export class DeleteUserDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class AdminDto {
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(10)
  password!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}
