import { Injectable } from '@nestjs/common';
import { AuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private userService: UserService) {}

    async validateUser({email, password}: AuthPayLoadDto) {
        const userDB = await this.userService.findUser(email);
        if(userDB != null && userDB.passwordHash == password){
            return this.jwtService.sign(userDB);
        } else {
            return null;
        }
    }
}
