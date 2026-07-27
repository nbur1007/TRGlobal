import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import { AdminCreateUserDto } from './dto/AdminCreateUser.dto';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('create_admin')
  @UsePipes(ValidationPipe)
  @Roles(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createAdmin(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return this.userService.createAdmin(adminCreateUserDto);
  }
}
