import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../catalogue/dto/product.dto';
import { OrderByUserDto, OrderUpdateDto } from './dto/order.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { fromCents, toCents } from '../utils/money';
import { OrderStatus } from 'generated/prisma/enums';
import { truncate } from 'node:fs/promises';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getHistory(userId: string, paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
        skip,
        take,
      }),
      this.prismaService.order.count({
        where: { userId },
      }),
    ]);

    return {
      orders,
      total,
      skip,
      take,
      hasMore: skip + orders.length < total,
    };
  }

  async createOrder(user: string) {
     try { 
      return this.prismaService.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: { userId: user },
          include: { items: { include: { product: true } } },
        });

        if (cart === null) {
          throw new HttpException('Cart not found.', HttpStatus.NOT_FOUND);
        }

        if (cart.items.length === 0) {
          throw new HttpException('Cart is empty.', HttpStatus.BAD_REQUEST);
        }

        let totalCents = 0;

        for (const item of cart.items) {
          const result = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (result.count === 0) {
            throw new HttpException(
              `Insufficient stock for ${item.product.name}.`,
              HttpStatus.CONFLICT,
            );
          }

          const lineCents = toCents(item.product.price) * item.quantity;

          totalCents += lineCents;
        }

        const lineItems = cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
          lineTotal: fromCents(toCents(item.product.price) * item.quantity),
        }));

        const order = await tx.order.create({
          data: {
            userId: user,
            total: fromCents(totalCents),
            items: { create: lineItems },
          },
        });

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;
      });
     } catch (err) {
        throw new InternalServerErrorException('Something went wrong. Our bad...');
     }
  }

  async updateOrderStatus(order: OrderUpdateDto) {
    try {
      const updatedOrder = await this.prismaService.order.update({
        where: { id: order.id },
        data: { status: order.status },
      });

      return updatedOrder;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Order Not Found.', HttpStatus.NOT_FOUND);
        }
      }
      throw err;
    }
  }

  async listAllOrders(paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        orderBy: {
          userId: 'asc',
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prismaService.order.count(),
    ]);

    return { orders, total, skip, take, hasMore: skip + orders.length < total };
  }

  async getOrdersByUser(query: OrderByUserDto) {
    const { skip, take } = query;

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where: { userId: query.userId },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
        skip,
        take,
      }),
      this.prismaService.order.count({
        where: { userId: query.userId },
      }),
    ]);

    return {
      orders,
      total,
      skip,
      take,
      hasMore: skip + orders.length < total,
    };
  }

  async getCancelRequests(paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;

    const [orders, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where: { cancelRequest: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prismaService.order.count({
        where: { cancelRequest: true },
      }),
    ]);

    return {
      orders,
      total,
      skip,
      take,
      hasMore: skip + orders.length < total,
    };
  }

  async cancelRequest(userId: string, order: OrderUpdateDto) {
    const result = await this.prismaService.order.updateMany({
      where: {
        id: order.id,
        userId,
        status: OrderStatus.PENDING,
      },
      data: { cancelRequest: true },
    });

    if (result.count === 0) {
      throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
    }
  }
}
