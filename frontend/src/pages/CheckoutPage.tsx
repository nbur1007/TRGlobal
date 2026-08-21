import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart } from '../api/cart';
import { createOrder } from '../api/order';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Cart } from '../api/types';
import placeholder from '../assets/NIA.png';

export function CheckoutPage() {
  usePageTitle('Checkout');

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  // None of this is stored, it's purely aesthetic.
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getCart()
      .then(setCart)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handlePlaceOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPlacing(true);
    setError(null);

    try {
      const order = await createOrder();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order.');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <p>
        Your cart is empty. <Link to="/">Continue shopping</Link>
      </p>
    );
  }

  return (
    <div className="checkout-page">
      <section className="checkout-summary">
        <h2>Order summary</h2>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id}>
                <td className="cart-product">
                  <img
                    src={item.product.imageUrl ?? placeholder}
                    alt={item.product.name}
                  />
                  <span>{item.product.name}</span>
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
              <td>€{cart.total}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="checkout-form">
        <h2>Delivery &amp; payment</h2>

        <form onSubmit={handlePlaceOrder}>
          {error && <p className="error">{error}</p>}

          <label htmlFor="name">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />

          <label htmlFor="address">Address</label>
          <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required autoComplete="street-address" />

          <div className="field-row">
            <div>
              <label htmlFor="city">City</label>
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required autoComplete="address-level2" />
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required autoComplete="country-name" />
            </div>
          </div>

          <label htmlFor="card">Card number</label>
          <input
            id="card"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
          />

          <div className="field-row">
            <div>
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                placeholder="12/29"
                maxLength={5}
                pattern="\d{2}/\d{2}"
              />
            </div>
            <div>
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                pattern="\d{3,4}"
              />
            </div>
          </div>

          <button type="submit" disabled={placing}>
            {placing ? 'Placing order…' : `Place order — €${cart.total}`}
          </button>
        </form>
      </section>
    </div>
  );
}
