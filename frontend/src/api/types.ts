//-----------------------------------------------
// Catalogue
//-----------------------------------------------
export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
};

export type ProductUpdateData = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
};

export type ProductCreationData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
};

export type CategoryUpdateData = {
  id: string;
  name?: string;
  slug?: string;
};

export type CategoryCreationData = {
  name: string;
  slug: string;
};

//-----------------------------------------------
// Authorization
//-----------------------------------------------

export type AuthorizationPayload = {
  email: string;
  password: string;
};

export type LoginResponse = { access_token: string };

export type AuthStatus = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

//-----------------------------------------------
// User
//-----------------------------------------------

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
};

export type UserListResponse = {
  users: User[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
};

export type UserCreationData = {
  email: string;
  password: string;
  name: string;
};

export type AdminCreationData = {
  email: string;
  password: string;
  name: string;
  role: "ADMIN";
};

//-----------------------------------------------
// Cart
//-----------------------------------------------

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  lineTotal: string;
};

export type Cart = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  total: string;
  itemCount: number;
};

export type CartItemData = {
  productId: string;
  quantity: number;
};

//-----------------------------------------------
// Order
//-----------------------------------------------

export type Order = {
  id: string;
  status: 'PENDING' | 'SHIPPED' | 'CANCELLED';
  total: string;
  createdAt: string;
  updatedAt: string;
  cancelRequest: boolean;
  user: User;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};

export type OrderListReturn = {
  orders: Order[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
};

export type UpdateOrderData = {
  id: string;
  status: 'PENDING' | 'SHIPPED' | 'CANCELLED';
}
