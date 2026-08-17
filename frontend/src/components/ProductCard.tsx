import type { Product } from "../api/types";
import placeholder from "../assets/NIA.png";

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
        <p
          className={product.stock > 0 ? "stock in-stock" : "stock out-of-stock"}
        >
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </p>
      </p>
    </article>
  );
}
