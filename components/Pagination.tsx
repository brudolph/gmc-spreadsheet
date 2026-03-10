'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm text-gray-600">
          Per page:
        </label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm bg-white"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
