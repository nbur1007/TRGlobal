import { Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { ModerateThrottle } from '../common/decorators/custom-throttler.decorator';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import type { Request } from 'express';
import { PaginationDto } from '../catalogue/dto/product.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('history')
  @ModerateThrottle()
  @Roles(Role.CUSTOMER)
  getHistory(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    const user = req.user as { id: string };
    return this.orderService.getHistory(user.id, paginationDto);
  }

  @Post('create-order')
  @ModerateThrottle()
  @Roles(Role.CUSTOMER)
  createOrder() {}

  @Patch('update-order-status')
  @Roles(Role.ADMIN)
  updateOrderStatus() {}
}
