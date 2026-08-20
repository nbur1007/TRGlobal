import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import type { Product } from "../api/types";
import placeholder from "../assets/NIA.png";
import { addToCart } from "../api/cart";

export function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    if (!product) return;

    setAdding(true);
    try {
      await addToCart({ productId: product.id, quantity });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <article className="product-page">
      <title>{product.name}</title>
      <img src={product.imageUrl ?? placeholder} alt={product.name} />

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">€{product.price}</p>
        <p className="description">{product.description}</p>
        <p
          className={
            product.stock > 0 ? "stock in-stock" : "stock out-of-stock"
          }
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="add-to-cart">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={product.stock}
          />
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {adding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
