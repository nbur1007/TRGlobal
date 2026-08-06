import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../catalogue/dto/product.dto';

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

  async updateOrderStatus() {}

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
