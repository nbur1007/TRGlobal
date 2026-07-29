import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsUUID, Max } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(100)
  take: number = 10;
}

export class ProductQueryDto extends PaginationDto {
  @IsUUID()
  categoryId!: string;
}

export class ProductByIdDto {
  @IsUUID()
  productId!: string;
}
