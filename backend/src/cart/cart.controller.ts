import { Controller, Get, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartsService: CartService) {}

  @Get('cart')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  getCart(@Query() cartDto: CartDto){
    return this.cartsService.getCart(cartDto);
  }
}
