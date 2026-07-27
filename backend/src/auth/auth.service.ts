import { Injectable } from '@nestjs/common';
import { AuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePasswords } from '../utils/bcrypt';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser({ email, password }: AuthPayLoadDto) {
    const userDB = await this.userService.findUserAuth(email);
    if (userDB && comparePasswords(password, userDB.passwordHash)) {
      const { passwordHash, ...user } = userDB;
      return user;
    }
    return null;
  }

  login(user: { id: string; email: string; role: Role }) {
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
