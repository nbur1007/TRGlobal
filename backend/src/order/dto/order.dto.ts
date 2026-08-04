import { OrderItem } from "generated/prisma/client";
import { OrderStatus } from "generated/prisma/enums";

export class OrderDto {
    userId!: string;


    status!: OrderStatus;


    items!: [OrderItem]
}
