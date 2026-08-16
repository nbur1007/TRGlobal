import { api } from "./client";
import type { Cart, CartItemData } from "./types";

export function getCart() {
  return api.get<Cart>("/cart");
}

export function addToCart(data: CartItemData) {
  return api.patch<Cart>("/cart/add-to-cart", data);
}

export function removeFromCart(data: CartItemData) {
  return api.patch<Cart>("/cart/remove-from-cart", data);
}
