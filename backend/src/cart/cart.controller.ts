import { Body, Controller, Delete, Get, Patch, Query, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { CartItemDto, CartSearchDto } from './dto/cart.dto';
import type { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartsService: CartService) {}

  @Get()
  @Roles(Role.CUSTOMER)
  getCart(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.cartsService.getCart(user.id);
  }

  @Patch('add-to-cart')
  @Roles(Role.CUSTOMER)
  addToCart(@Req() req: Request, @Body() cartItemDto: CartItemDto) {
    const user = req.user as { id: string };
    return this.cartsService.addToCart(user.id, cartItemDto);
  }

  @Patch('remove-from-cart')
  @Roles(Role.CUSTOMER)
  removeFromCart(@Req() req: Request, @Body() cartItemDto: CartItemDto) {
    const user = req.user as { id: string };
    return this.cartsService.removeFromCart(user.id, cartItemDto);
  }

  @Delete('delete-own-cart')
  @Roles(Role.CUSTOMER)
  deleteOwnCart(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.cartsService.deleteCart(user.id);
  }

  @Delete('delete-other-cart')
  @Roles(Role.ADMIN)
  deleteOtherCart(@Query() cartSearchDto: CartSearchDto) {
    return this.cartsService.deleteCart(cartSearchDto.userId);
  }
}
