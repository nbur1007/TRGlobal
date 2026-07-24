import { Injectable } from '@nestjs/common';
import { AuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePasswords } from '../utils/bcrypt';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private userService: UserService) {}

    async validateUser({email, password}: AuthPayLoadDto) {
        const userDB = await this.userService.findUser(email);
        
        if(userDB != null && comparePasswords(password, userDB.passwordHash)){
            return this.jwtService.sign({ sub: userDB.id, email: userDB.email });    
        } else {
            return null;
        }
    }
}
