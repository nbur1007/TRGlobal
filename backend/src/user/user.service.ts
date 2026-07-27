import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { PrismaService } from '../prisma.service';
import { encodePassword } from '../utils/bcrypt';
import { AdminCreateUserDto } from './dto/AdminCreateUser.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    let emailAttempt;
    try {
      emailAttempt = await this.prismaService.user.findFirst({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    console.log(emailAttempt);
    if (emailAttempt != null) {
      throw new BadRequestException('Email is already registered.');
    }

    let password = encodePassword(createUserDto.password);

    try {
      await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: password,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findUser(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createAdmin(adminCreateUserDto: AdminCreateUserDto) {
    let emailAttempt;
    try {
      emailAttempt = await this.prismaService.user.findFirst({
        where: {
          email: adminCreateUserDto.email,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    console.log(emailAttempt);
    if (emailAttempt != null) {
      throw new BadRequestException('Email is already registered.');
    }

    let password = encodePassword(adminCreateUserDto.password);

    try {
      await this.prismaService.user.create({
        data: {
          name: adminCreateUserDto.name,
          email: adminCreateUserDto.email,
          passwordHash: password,
          role: adminCreateUserDto.role
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async deleteUser(email: string) {
    try {
      const deleteUser = await this.prismaService.user.delete({
      where: {
        email: email
      },
      }); 
    } catch (err) {
      throw new BadRequestException('This user does not exist.');
    }
  }
}
