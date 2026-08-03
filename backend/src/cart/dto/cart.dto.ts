import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CartSearchDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}

export class CartItemDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
