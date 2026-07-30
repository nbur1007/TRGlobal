import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Max,
} from 'class-validator';

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
  @IsNotEmpty()
  id!: string;
}

export class CreateOrEditProductDto extends ProductByIdDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  stock!: number;

  @IsNotEmpty()
  @IsUrl()
  imageUrl!: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
}
