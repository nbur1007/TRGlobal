import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { CartDto } from './dto/cart.dto';
import type { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartsService: CartService) {}

  @Get('cart')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  getCart(@Query() cartDto: CartDto) {
    return this.cartsService.getCart(cartDto);
  }

  @Post('create-cart')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  createCart(@Req() req: Request, @Body() cartDto: CartDto) {
    const user = req.user as { id: string }
    return this.cartsService.createCart(user.id, cartDto);
  }

  @Delete('delete-own-cart')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  deleteOwnCart(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.cartsService.deleteCart(user.id);
  }

  @Delete('delete-other-cart')
  @Roles(Role.ADMIN)
  deleteOtherCart(@Query() cartDto: CartDto) {
    return this.cartsService.deleteCart(cartDto.userId);
  }
}
