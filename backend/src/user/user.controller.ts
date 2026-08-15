import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  UserDto,
  AdminDto,
  UpdateUserDto,
  DeleteUserDto,
  ListByRoleDto,
} from './dto/user.dto';
import { UserService } from './user.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import type { Request } from 'express';
import { ModerateThrottle, StrictThrottle } from '../common/decorators/custom-throttler.decorator';
import { PaginationDto } from '../catalogue/dto/product.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('create')
  @StrictThrottle()
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

  @Get('list-by-role')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  listUsers(@Query() query: ListByRoleDto) {
    return this.userService.listByRole(query);
  }

  @Get('all-users')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  listAll(@Query() paginationDto: PaginationDto) {
    return this.userService.listAll(paginationDto);
  }

  @Post('create-admin')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  createAdmin(@Body() adminCreateUserDto: AdminDto) {
    return this.userService.createAdmin(adminCreateUserDto);
  }

  @Delete('delete-self')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UsePipes(ValidationPipe)
  deleteSelf(@Req() req: Request) {
    const user = req.user as { id: string; email: string; role: Role };
    return this.userService.deleteUser(user.id);
  }

  @Delete('delete-user')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  deleteUser(@Body() user: DeleteUserDto) {
    return this.userService.deleteUser(user.id);
  }
}
