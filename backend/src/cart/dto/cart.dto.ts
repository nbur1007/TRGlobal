import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CartItem } from 'generated/prisma/browser';

export class CartDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id!: string;
  
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  items!: CartItem[];
}
