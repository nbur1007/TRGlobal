import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class ProductDto {}

export class PaginationDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip!: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    take!: number;
}
