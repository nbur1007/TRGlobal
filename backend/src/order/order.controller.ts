import { Controller, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ModerateThrottle } from '../common/decorators/custom-throttler.decorator';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create-order')
  @ModerateThrottle()
  @Roles(Role.CUSTOMER)
  createOrder() {}

  @Patch('update-order-status')
  @Roles(Role.ADMIN)
  updateOrderStatus() {}
}
