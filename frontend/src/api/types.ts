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
  price?: string;
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

export type AuthorizationPayload = {
    email: string;
    password: string;
}

export type AuthStatus = {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
