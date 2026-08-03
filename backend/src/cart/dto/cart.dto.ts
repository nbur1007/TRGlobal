import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CartSearchDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class CartItemDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  cartId!: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @IsNotEmpty()
  quatinity!: number;
}
