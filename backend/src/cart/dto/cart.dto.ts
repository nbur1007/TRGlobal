import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CartItem } from 'generated/prisma/client';

export class CartSearchDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
