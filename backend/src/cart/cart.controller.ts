import {
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
import { CartSearchDto } from './dto/cart.dto';
import type { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartsService: CartService) {}

  @Get()
  @Roles(Role.CUSTOMER)
  getCart(@Req() req: Request) {
    const user = req.user as { id: string }
    return this.cartsService.getCart(user.id);
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
