import { usePageTitle } from "../hooks/usePageTitle";
import { type Cart } from "../api/types";
import { useEffect, useState } from "react";
import { getCart } from "../api/cart";
import placeholder from "../assets/NIA.png";
import { Link } from "react-router-dom";

export function CartPage() {
  usePageTitle("Cart");
  const [data, setData] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCart()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
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
                  <td>{item.quantity}</td>
                  <td>€{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total</td>
                <td>€{data.total}</td>
              </tr>
            </tfoot>
          </table>

          <button className="checkout-button">Checkout</button>
        </div>
      )}
    </div>
  );
}
