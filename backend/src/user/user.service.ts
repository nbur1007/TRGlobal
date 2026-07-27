import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDto } from './dto/User.dto';
import { PrismaService } from '../prisma.service';
import { encodePassword } from '../utils/bcrypt';
import { AdminDto } from './dto/Admin.dto';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserDto: UserDto) {
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

  async createAdmin(adminCreateUserDto: AdminDto) {
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
          role: adminCreateUserDto.role,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async deleteUser(id: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw new BadRequestException('This user does not exist.');
    }
  }

  async updateRole(id: string, role: Role) {
    try {
      await this.prismaService.user.update({
        where: { id: id },
        data: { role: role },
      });
    } catch (err) {
      throw new BadRequestException('This user does not exist.')
    }
  }

  async listByRole(role: Role) {
    try {
      await this.prismaService.user.findMany({
        where: {role: role}
    })
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async listAll(){
    await this.prismaService.user.findMany()
  }
}
