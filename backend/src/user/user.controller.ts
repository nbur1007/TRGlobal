import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dto/User.dto';
import { UserService } from './user.service';
import { AdminDto } from './dto/Admin.dto';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: UserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @Delete('delete_self')
  @UsePipes(ValidationPipe)
  deleteSelf(@Body() user: UserDto, @Req() req: Request){
    if(user === req.user ){
      return this.userService.deleteUser(user.email);
    } else {
      throw new BadRequestException('You cannot delete other users, only yourself.')
    }
  }


  @Post('create_admin')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  createAdmin(@Body() adminCreateUserDto: AdminDto) {
    return this.userService.createAdmin(adminCreateUserDto);
  }

  @Delete('delete_user')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  deleteUser(@Body() user: UserDto){
    return this.userService.deleteUser(user.email);
  }

  @Get('list')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  listUsers(@Body() user: AdminDto){
    return this.userService.listUsers(user);
  }
}
