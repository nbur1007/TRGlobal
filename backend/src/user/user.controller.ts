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
import {
  UserDto,
  AdminDto,
  UpdateUserDto,
  DeleteUserDto,
} from './dto/user.dto';
import { UserService } from './user.service';
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

  @Get('me')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UsePipes(ValidationPipe)
  getSelf(@Req() req: Request) {
    const user = req.user as { id: string; email: string; role: Role };
    return this.userService.findUser(user.id);
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

  @Post('create_admin')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  createAdmin(@Body() adminCreateUserDto: AdminDto) {
    return this.userService.createAdmin(adminCreateUserDto);
  }

  @Patch('update_role')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  promoteUser(@Body() user: UpdateUserDto) {
    return this.userService.updateRole(user.id, user.role);
  }

  @Delete('delete_self')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UsePipes(ValidationPipe)
  deleteSelf(@Req() req: Request) {
    const user = req.user as { id: string; email: string; role: Role };
    return this.userService.deleteUser(user.id);
  }

  @Delete('delete_user')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  deleteUser(@Body() user: DeleteUserDto) {
    return this.userService.deleteUser(user.id);
  }
}
