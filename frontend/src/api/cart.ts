import { api } from "./client";
import type { Cart, CartItem } from "./types";

export function getCart(userId: string) {
  return api.get<Cart>("/cart", { userId });
}

export function addToCart(data: CartItem) {
  return api.patch<Cart>("/cart/add-to-cart", data);
}

export function removeFromCart(data: CartItem) {
  return api.patch<Cart>("/cart/remove-from-cart", data);
}
