import { IsNotEmpty, IsUUID } from "class-validator";
import { OrderItem } from "generated/prisma/client";
import { OrderStatus } from "generated/prisma/enums";

export class OrderUpdateDto {
    @IsNotEmpty()
    @IsUUID()
    id!: string;

    @IsNotEmpty()
    status!: OrderStatus;
}

export class OrderByUserDto {
    @IsNotEmpty()
    @IsUUID()
    userId!: string;
}
