import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../catalogue/dto/product.dto';
import { OrderUpdateDto } from './dto/order.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

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

  async createOrder() {}

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

  async getOrderByUser() {}
}
