import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProducts } from '../api/products';
import type { ProductListResponse } from '../api/types';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';

export function CataloguePage() {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const skip = Number(searchParams.get('skip') ?? 0);
  const take = Number(searchParams.get('take') ?? 10);

  useEffect(() => {
    setLoading(true);
    setError(null);

    listProducts(skip, take)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [skip, take]);

  function goToPage(newSkip: number) {
    setSearchParams({ skip: String(newSkip), take: String(take) });
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!data || data.products.length === 0) return <p>No products found.</p>;

  return (
    <div>
      <h1>Products</h1>

      <div className="product-grid">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        skip={skip}
        take={take}
        total={data.total}
        hasMore={data.hasMore}
        onPageChange={goToPage}
      />
    </div>
  );
}
