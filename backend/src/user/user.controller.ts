import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dto/User.dto';
import { UserService } from './user.service';
import { AdminDto } from './dto/Admin.dto';
import { ExistingUserDto } from './dto/ExistingUser.dto';
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

  @Delete('delete_self')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UsePipes(ValidationPipe)
  deleteSelf(@Req() req: Request) {
    const user = req.user as { id: string; email: string; role: Role };
    return this.userService.deleteUser(user.id);
  }

  @Get('me')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UsePipes(ValidationPipe)
  getSelf(@Req() req: Request) {
    const user = req.user as { id: string; email: string; role: Role };
    return this.userService.findUser(user.id);
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
  deleteUser(@Body() user: ExistingUserDto) {
    return this.userService.deleteUser(user.id);
  }

  @Get('list_by_role')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  listUsers(@Body() user: AdminDto) {
    return this.userService.listByRole(user.role);
  }

  @Get('all_users')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  listAll() {
    return this.userService.listAll();
  }

  @Patch('update_role')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  promoteUser(@Body() user: ExistingUserDto) {
    return this.userService.updateRole(user.id, user.role);
  }
}
