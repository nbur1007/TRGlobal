import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { CartDto } from './dto/cart.dto';

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
  createCart() {}

  @Delete('delete-own-cart')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  deleteOwnCart(@Query() cartDto: CartDto) {}

  @Delete('delete-other-cart')
  @Roles(Role.ADMIN)
  deleteOtherCart(@Query() cartDto: CartDto) {}
}
