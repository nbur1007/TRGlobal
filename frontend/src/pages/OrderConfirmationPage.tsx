import { useLocation, Link, Navigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Order } from '../api/types';

export function OrderConfirmationPage() {
  usePageTitle('Order confirmed');

  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  if (!order) {
    return <Navigate to="/order" replace />;
  }

  const placed = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Thank you for your order</h1>
        <p>Your order has been placed successfully.</p>
      </div>

      <dl className="order-meta">
        <div>
          <dt>Order reference</dt>
          <dd>{order.id}</dd>
        </div>
        <div>
          <dt>Date placed</dt>
          <dd>{placed}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{order.status}</dd>
        </div>
      </dl>

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
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>€{item.unitPrice}</td>
              <td>{item.quantity}</td>
              <td>€{item.lineTotal}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Total</td>
            <td>€{order.total}</td>
          </tr>
        </tfoot>
      </table>

      <div className="confirmation-actions">
        <Link to="/" className="button-secondary">
          Return to catalogue
        </Link>
        <Link to="/order" className="button-primary">
          View order history
        </Link>
      </div>
    </div>
  );
}
