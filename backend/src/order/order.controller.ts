import { Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { ModerateThrottle } from '../common/decorators/custom-throttler.decorator';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import type { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('history')
  @ModerateThrottle()
  @Roles(Role.CUSTOMER)
  getHistory(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.orderService.getHistory(user.id);
  }

  @Post('create-order')
  @ModerateThrottle()
  @Roles(Role.CUSTOMER)
  createOrder() {}

  @Patch('update-order-status')
  @Roles(Role.ADMIN)
  updateOrderStatus() {}
}
