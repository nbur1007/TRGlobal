import { Injectable } from '@nestjs/common';
import { AuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUsers = [
    {
        id: 1,
        username: 'guy',
        password: 'test1'
    },
    {
        id: 2,
        username: 'guy2',
        password: 'test2'
    }
]

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) {}

    validateUser({username, password}: AuthPayLoadDto) {
        const findUser = fakeUsers.find((user) => user.username === username);
        if (!findUser) return null; 
        if (password === findUser.password){
            const {password, ...user} = findUser;  
            return this.jwtService.sign(user);
        }
    }
}
