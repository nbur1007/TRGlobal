import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDto, AdminDto, ListByRoleDto } from './dto/user.dto';
import { PrismaService } from '../prisma.service';
import { encodePassword } from '../utils/bcrypt';
import { Role } from 'generated/prisma/enums';
import { PaginationDto } from '../catalogue/dto/product.dto';

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
          cart: { create: {} },
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

  async listByRole(listByRoleDto: ListByRoleDto) {
   const { skip, take } = listByRoleDto;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: {role: listByRoleDto.role},
        orderBy: { createdAt: 'desc' },
        omit: { passwordHash: true },
        skip,
        take,
      }),
      this.prismaService.user.count(),
    ]);

    return { users, total, skip, take, hasMore: skip + users.length < total };
  }

  async listAll(paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        orderBy: { createdAt: 'desc' },
        omit: { passwordHash: true },
        skip,
        take,
      }),
      this.prismaService.user.count(),
    ]);

    return { users, total, skip, take, hasMore: skip + users.length < total };
  }
}
