import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CategorySelectDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;
}

export class UpdateCategoryDto extends CategorySelectDto {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug!: string;
}

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;
}
