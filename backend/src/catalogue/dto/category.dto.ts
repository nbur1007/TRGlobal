import { IsUUID } from "class-validator";


export class CategoryDto {
    @IsUUID()
    id!: string;
}
