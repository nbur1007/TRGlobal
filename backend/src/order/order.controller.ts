import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ModerateThrottle,
  StrictThrottle,
} from '../utils/custom-throttler.decorator';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import type { Request } from 'express';
import { PaginationDto } from '../catalogue/dto/product.dto';
import { FindOrderDto, OrderByUserDto, OrderUpdateDto } from './dto/order.dto';

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

  @Get('all-orders')
  @StrictThrottle()
  @Roles(Role.ADMIN)
  listAllOrders(@Query() paginationDto: PaginationDto) {
    return this.orderService.listAllOrders(paginationDto);
  }

  @Get('orders-by-user')
  @ModerateThrottle()
  @Roles(Role.ADMIN)
  getOrdersByUser(@Query() query: OrderByUserDto) {
    return this.orderService.getOrdersByUser(query);
  }

  @Get('cancel-requests')
  @ModerateThrottle()
  @Roles(Role.ADMIN)
  getCancelRequests(@Query() paginationDto: PaginationDto) {
    return this.orderService.getCancelRequests(paginationDto);
  }

  @Post('create-order')
  @ModerateThrottle()
  @Roles(Role.CUSTOMER)
  createOrder(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.orderService.createOrder(user.id);
  }

  @Patch('update-order-status')
  @Roles(Role.ADMIN)
  updateOrderStatus(@Query() orderUpdateDto: OrderUpdateDto) {
    return this.orderService.updateOrderStatus(orderUpdateDto);
  }

  @Patch('cancel-order')
  @Roles(Role.CUSTOMER)
  cancelRequest(@Req() req: Request, @Query() findOrderDto: FindOrderDto) {
    const user = req.user as { id: string };
    return this.orderService.cancelRequest(user.id, findOrderDto);
  }
}
