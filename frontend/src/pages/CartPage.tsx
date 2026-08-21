import { usePageTitle } from "../hooks/usePageTitle";
import { type Cart, type CartItem } from "../api/types";
import { useEffect, useState } from "react";
import { addToCart, getCart, removeFromCart } from "../api/cart";
import placeholder from "../assets/NIA.png";
import { Link } from "react-router-dom";
import { QuantityInput } from "../components/QuantityInput";

export function CartPage() {
  usePageTitle("Cart");
  const [data, setData] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getCart()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function changeQuantity(item: CartItem, newQuantity: number) {
    const difference = newQuantity - item.quantity;
    if (difference === 0) return;

    setUpdating(true);
    try {
      const updated =
        difference > 0
          ? await addToCart({ productId: item.productId, quantity: difference })
          : await removeFromCart({
              productId: item.productId,
              quantity: -difference,
            });
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update cart.");
    } finally {
      setUpdating(false);
    }
  }

  async function adjustQuantity(item: CartItem, delta: number) {
    setUpdating(true);
    try {
      const updated =
        delta > 0
          ? await addToCart({ productId: item.productId, quantity: delta })
          : await removeFromCart({
              productId: item.productId,
              quantity: -delta,
            });
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update cart.");
    } finally {
      setUpdating(false);
    }
  }

  async function removeItem(item: CartItem) {
    setUpdating(true);
    try {
      const updated = await removeFromCart({
        productId: item.productId,
        quantity: item.quantity,
      });
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove item.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <h1>Cart</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data && data.items.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="cart-product">
                    <img
                      src={item.product.imageUrl ?? placeholder}
                      alt={item.product.name}
                    />
                    <Link to={`/products/${item.product.id}`}>
                      {item.product.name}
                    </Link>
                  </td>
                  <td>€{item.product.price}</td>
                  <td>
                    <div className="qty-control">
                      <button
                        onClick={() => adjustQuantity(item, -1)}
                        disabled={updating}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <QuantityInput
                        item={item}
                        disabled={updating}
                        onCommit={changeQuantity}
                      />
                      <button
                        onClick={() => adjustQuantity(item, 1)}
                        disabled={updating}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>€{item.lineTotal}</td>
                  <td>
                    <button
                      onClick={() => removeItem(item)}
                      disabled={updating}
                      className="remove-button"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Total</td>
                <td>€{data.total}</td>
              </tr>
            </tfoot>
          </table>

          <Link to="/checkout" className="checkout-button">
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
