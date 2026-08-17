import type { Product } from '../api/types';
import placeholder from '../assets/NIA.png';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <img src={product.imageUrl ?? placeholder} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">£{product.price}</p>
      <p className="stock">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
    </article>
  );
}
