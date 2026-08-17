type PaginationProps = {
  skip: number;
  take: number;
  total: number;
  hasMore: boolean;
  onPageChange: (newSkip: number) => void;
};

export function Pagination({
  skip,
  take,
  total,
  hasMore,
  onPageChange,
}: PaginationProps) {
  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(total / take);

  return (
    <nav className="pagination">
      <button onClick={() => onPageChange(skip - take)} disabled={skip === 0}>
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button onClick={() => onPageChange(skip + take)} disabled={!hasMore}>
        Next
      </button>
    </nav>
  );
}
