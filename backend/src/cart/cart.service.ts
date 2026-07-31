import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async getCart(cart: CartDto){

  }

  async createCart(userId: string, cart: CartDto) {
    
  }

  async deleteCart(userId: string) {
    try {
          await this.prismaService.cart.delete({
            where: {
              userId: userId,
            },
          });
          return;
        } catch (err) {
          throw new HttpException(
            'This user does not exist or have a cart.',
            HttpStatus.NOT_FOUND,
          );
        }
  }
}
