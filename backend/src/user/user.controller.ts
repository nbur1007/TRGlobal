import {
  Body,
  Controller,
  Delete,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import { AdminCreateUserDto } from './dto/AdminCreateUser.dto';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('create_admin')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  createAdmin(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return this.userService.createAdmin(adminCreateUserDto);
  }

  @Delete('delete_user')
  @Roles(Role.ADMIN)
  deleteUser(){

  }
}
