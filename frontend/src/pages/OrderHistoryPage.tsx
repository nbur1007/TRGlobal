import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getHistory, requestCancel } from '../api/order';
import { Pagination } from '../components/Pagination';
import { usePageTitle } from '../hooks/usePageTitle';
import type { OrderListReturn } from '../api/types';

export function OrderHistoryPage() {
  usePageTitle('Orders');

  const [data, setData] = useState<OrderListReturn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Which rows are expanded — a Set of order ids
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [searchParams, setSearchParams] = useSearchParams();
  const skip = Number(searchParams.get('skip') ?? 0);
  const take = Number(searchParams.get('take') ?? 5);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getHistory(skip, take)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [skip, take]);

  function goToPage(newSkip: number) {
    setSearchParams({ skip: String(newSkip), take: String(take) });
  }

  function toggleExpanded(orderId: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  async function handleCancel(orderId: string) {
    setCancelling(orderId);
    try {
      await requestCancel(orderId);
      const refreshed = await getHistory(skip, take);
      setData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request cancellation.');
    } finally {
      setCancelling(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="order-history">
      <h1>Orders:</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data && data.orders.length === 0 && (
        <p>You haven't placed any orders yet.</p>
      )}

      {!loading && !error && data && data.orders.length > 0 && (
        <>
          <div className="order-list">
            {data.orders.map((order) => {
              const isOpen = expanded.has(order.id);

              return (
                <article key={order.id} className="order-row">
                  <div className="order-row-header">
                    <div className="order-row-main">
                      <h2>Order from {formatDate(order.createdAt)}</h2>
                      <p className="order-row-meta">
                        <span className={`status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                        {order.cancelRequest && order.status === 'PENDING' && (
                          <span className="cancel-pending">Cancellation requested</span>
                        )}
                        <span>€{order.total}</span>
                      </p>
                    </div>

                    <button
                      className="details-toggle"
                      onClick={() => toggleExpanded(order.id)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? 'Hide details' : 'View details'}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="order-row-details">
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

                      <p className="order-reference">Reference: {order.id}</p>

                      {order.status === 'PENDING' && !order.cancelRequest && (
                        <button
                          className="cancel-button"
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                        >
                          {cancelling === order.id
                            ? 'Requesting…'
                            : 'Request cancellation'}
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <Pagination
            skip={skip}
            take={take}
            total={data.total}
            hasMore={data.hasMore}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}
