import { IsNumber, IsOptional, IsPositive, IsUUID, isUUID } from "class-validator";

export class CategoryDto {
    @IsUUID()
    categoryId!: string;
}

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
