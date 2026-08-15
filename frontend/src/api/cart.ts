import { api } from "./client";
import type { Cart, CartItem } from "./types";

export function getCart() {
  return api.get<Cart>("/cart");
}

export function addToCart(data: CartItem) {
  return api.patch<Cart>("/cart/add-to-cart", data);
}

export function removeFromCart(data: CartItem) {
  return api.patch<Cart>("/cart/remove-from-cart", data);
}
