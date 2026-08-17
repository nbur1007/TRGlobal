import { IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from 'generated/prisma/enums';
import { PaginationDto } from '../../catalogue/dto/product.dto';

export class FindOrderDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;
}

export class OrderUpdateDto extends FindOrderDto {
  @IsNotEmpty()
  status!: OrderStatus;
}

export class OrderByUserDto extends PaginationDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;
}
