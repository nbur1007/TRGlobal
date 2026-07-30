import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async getCart(cart: CartDto){}
}
