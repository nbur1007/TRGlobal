import { api } from "./client";
import { type Order, type OrderListReturn, type UpdateOrderData } from "./types";

export function getHistory(skip: number, take: number) {
  return api.get<OrderListReturn>("/order/history", { skip, take });
}

export function getAllOrders(skip: number, take: number) {
  return api.get<OrderListReturn>("/order/all-orders", { skip, take });
}

export function getOrdersByUser(userId: string, skip: number, take: number) {
  return api.get<OrderListReturn>("/order/orders-by-user", {
    userId,
    skip,
    take,
  });
}

export function getCancelRequests(skip: number, take: number) {
  return api.get<OrderListReturn>("/order/cancel-requests", { skip, take });
}

export function createOrder() {
  return api.post<Order>("/order/create-order");
}

export function updateOrderStatus(newStatus: UpdateOrderData) {
  return api.patch<Order>("/order/update-order-status", newStatus)
}

export function requestCancel(orderId: string) {
  return api.patch<Order>("/order/cancel-order", orderId);
}
