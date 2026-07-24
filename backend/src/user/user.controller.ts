import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService

    ){}

    @Post('create')
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
}
