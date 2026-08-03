import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CartItemDto, CartSearchDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async getCart(id: string) {
    try {
      const cart = await this.prismaService.cart.findFirst({
        where: { userId: id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return cart;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException(
            'User not found: Cannot find cart.',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw err;
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
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException(
            'User not found: Cannot delete cart.',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw err;
    }
  }

  async addToCart(userId: string, cartItem: CartItemDto) {}

  async removeFromCart(userId: string, cartItem: CartItemDto) {}
}
