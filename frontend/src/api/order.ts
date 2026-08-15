import { api } from "./client";
import { type OrderListReturn } from "./types";

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

export function createOrder() {}

export function updateOrderStatus() {}

export function requestCancel() {}
