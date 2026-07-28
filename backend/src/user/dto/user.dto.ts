import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class DeleteUserDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class UpdateUserDto extends DeleteUserDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}

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

export class AdminDto extends UserDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}
