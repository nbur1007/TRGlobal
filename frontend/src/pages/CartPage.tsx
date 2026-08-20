import { usePageTitle } from "../hooks/usePageTitle";
import { type Cart, type CartItem } from "../api/types";
import { useEffect, useState } from "react";
import { getCart } from "../api/cart";
import placeholder from "../assets/NIA.png";

export function CartPage() {
  usePageTitle("Cart");
  const [data, setData] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  });

  useEffect(() => {
    getCart()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  });

  function listItems(items: CartItem[]){
    for(const cartItem of items) {
        return(
        <div>
            <img src={cartItem.product.imageUrl ?? placeholder}/>
        </div>
        )
    }
  }
   
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data && data.items.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <div>
            <div className="cart-content">
                {listItems(data.items)}
            </div>
        </div>
      )}
    </div>
  );
}
