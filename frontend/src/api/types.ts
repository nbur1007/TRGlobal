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
};
