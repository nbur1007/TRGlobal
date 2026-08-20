import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProducts, listByCategory, listCategories } from '../api/products';
import type { ProductListResponse, Category } from '../api/types';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { usePageTitle } from '../hooks/usePageTitle';

export function CataloguePage() {
  usePageTitle("Home")
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const skip = Number(searchParams.get('skip') ?? 0);
  const take = Number(searchParams.get('take') ?? 12);
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const request = categoryId
      ? listByCategory(categoryId, skip, take)
      : listProducts(skip, take);

    request
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [skip, take, categoryId]);

  function buildParams(newSkip: number, newCategoryId: string | null) {
    const params: Record<string, string> = {
      skip: String(newSkip),
      take: String(take),
    };
    if (newCategoryId) params.categoryId = newCategoryId;
    return params;
  }

  function goToPage(newSkip: number) {
    setSearchParams(buildParams(newSkip, categoryId));
  }

  function selectCategory(id: string | null) {
    setSearchParams(buildParams(0, id));
  }

  return (
    <div>
      <h1>Products</h1>

      <nav className="category-nav">
        <button
          onClick={() => selectCategory(null)}
          className={!categoryId ? 'active' : ''}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => selectCategory(category.id)}
            className={categoryId === category.id ? 'active' : ''}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data && data.products.length === 0 && (
        <p>No products found in this category.</p>
      )}

      {!loading && !error && data && data.products.length > 0 && (
        <div>
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
      )}
    </div>
  );
}
