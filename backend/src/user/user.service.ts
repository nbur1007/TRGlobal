import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDto, AdminDto } from './dto/user.dto';
import { PrismaService } from '../prisma.service';
import { encodePassword } from '../utils/bcrypt';
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

    if (emailAttempt != null) {
      throw new HttpException(
        'Email is already registered.',
        HttpStatus.CONFLICT,
      );
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

  async findUserAuth(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }

  async findUser(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
      omit: {
        passwordHash: true,
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

    if (emailAttempt != null) {
      throw new HttpException(
        'Email is already registered.',
        HttpStatus.CONFLICT,
      );
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
      throw new HttpException(
        'This user does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateRole(id: string, role: Role) {
    try {
      await this.prismaService.user.update({
        where: { id: id },
        data: { role: role },
      });
    } catch (err) {
      throw new HttpException(
        'This user does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async listByRole(role: Role) {
    try {
      const userList = await this.prismaService.user.findMany({
        where: { role: role },
        omit: {
          passwordHash: true,
        },
      });
      return userList;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async listAll() {
    const userList = await this.prismaService.user.findMany({
      omit: {
        passwordHash: true,
      },
    });

    return userList;
  }
}
