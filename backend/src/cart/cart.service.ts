import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CartSearchDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async getCart(cartSearchDto: CartSearchDto) {
    try {
        const cart = await this.prismaService.cart.findFirst({
          where: {userId: cartSearchDto.userId}
        })
    } catch(err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException(
            'User not found: Cannot find cart.',
            HttpStatus.NOT_FOUND,
          );
        }
      }
    }
  }

  async createCart(userId: string) {
    try {
      const newCart = await this.prismaService.cart.create({
        data: {
          userId: userId,
        },
      });

      return newCart;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException(
            'User not found: Cannot create a cart.',
            HttpStatus.NOT_FOUND,
          );
        }
        if (err.code === 'P2003') {
          throw new HttpException(
            'User already has a cart.',
            HttpStatus.CONFLICT,
          );
        }
      }
    }
  }

  async deleteCart(userId: string) {
    try {
      await this.prismaService.cart.delete({
        where: {
          userId: userId,
        },
      });
      return;
    } catch (err) {
      throw new HttpException(
        'This user does not exist or have a cart.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
