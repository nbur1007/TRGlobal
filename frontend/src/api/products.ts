import { api } from "./client";
import {
  type Product,
  type Category,
  type ProductListResponse,
  type ProductUpdateData,
  type ProductCreationData,
  type CategoryCreationData,
  type CategoryUpdateData,
} from "./types";

export function listProducts(skip: number, take: number) {
  return api.get<ProductListResponse>("/catalogue/list-products", {
    skip,
    take,
  });
}

export function listByCategory(skip: number, take: number) {
  return api.get<ProductListResponse>("/catalogue/products-by-category", {
    skip,
    take,
  });
}

export function getProduct(id: string) {
  return api.get<Product>("/catalogue/product-details", { id });
}

export function listCategories() {
  return api.get<Category[]>("/catalogue/list-categories");
}

export function createProduct(data: ProductCreationData) {
  return api.post<Product>("/catalogue/create-product", data);
}

export function deleteProduct(id: string) {
  return api.delete<Product>("/catalogue/delete-product", { id });
}

export function updateProduct(data: ProductUpdateData) {
  return api.patch<Product>("/catalogue/update-product", data);
}

export function createCategory(data: CategoryCreationData) {
  return api.post<Category>("/catalogue/create-category", data);
}

export function deleteCategory(id: string) {
  return api.delete<Category>("/catalogue/delete-category", { id });
}

export function updateCategory(data: CategoryUpdateData) {
  return api.patch<Category>("/catalogue/update-category", data);
}
