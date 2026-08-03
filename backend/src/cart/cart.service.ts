import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CartItemDto } from './dto/cart.dto';
import { fromCents, toCents } from '../utils/money';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async getCart(id: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId: id },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      throw new HttpException('Cart not found.', HttpStatus.NOT_FOUND);
    }
    let totalCents = 0;

    const items = cart.items.map((item) => {
      const unitCents = toCents(item.product.price);
      const lineCents = unitCents * item.quantity;
      totalCents += lineCents;

      return {
        ...item,
        lineTotal: fromCents(lineCents),
      };
    });

    return {
      ...cart,
      items,
      total: fromCents(totalCents),
      itemCount: items.length,
    };
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
          throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
        }
      }
      throw err;
    }
  }

  async addToCart(userId: string, cartItem: CartItemDto) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      throw new HttpException('Cart not found.', HttpStatus.NOT_FOUND);
    }

    try {
      const updatedCart = await this.prismaService.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: cartItem.productId,
          },
        },
        create: {
          cartId: cart.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        },
        update: {
          quantity: { increment: cartItem.quantity },
        },
        include: { product: true },
      });
      return updatedCart;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
        }
      }
      throw err;
    }
  }

  async removeFromCart(userId: string, decreaseRequest: CartItemDto) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      throw new HttpException('Cart not found.', HttpStatus.NOT_FOUND);
    }

    try {
      const item = await this.prismaService.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: decreaseRequest.productId,
          },
        },
      });

      if (!item) {
        throw new HttpException('Item not in cart.', HttpStatus.NOT_FOUND);
      }

      const quantAfterDecrease = item.quantity - decreaseRequest.quantity;

      if (quantAfterDecrease <= 0) {
        return await this.prismaService.cartItem.delete({
          where: { id: item.id },
          include: { product: true },
        });
      } else {
        return await this.prismaService.cartItem.update({
          where: { id: item.id },
          data: { quantity: quantAfterDecrease },
          include: { product: true },
        });
      }
    } catch (err) {
      throw err;
    }
  }
}
