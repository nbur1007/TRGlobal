import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, IsUrl, IsUUID, Max } from 'class-validator';

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

export class EditProductDto extends ProductByIdDto {
  @IsString()
  name!: string;
  
  @IsString()
  description!: string;
  
  @IsNumber()
  @IsPositive()
  price!: number;
  
  @IsNumber()
  stock!: number;
  
  @IsUrl()
  imageUrl!: string;
  
  @IsUUID()
  categoryId!: string;
}
