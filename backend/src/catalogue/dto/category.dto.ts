import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CategorySelectDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;
}

export class UpdateCategoryDto extends CategorySelectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;
}

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;
}
