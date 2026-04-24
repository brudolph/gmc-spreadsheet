'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS } from '@/lib/graphql/queries';

interface ProductsData {
  products: Product[];
  productsCount: number;
}
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ProductCardSkeleton } from '@/components/Skeleton';
import ErrorMessage from '@/components/ErrorMessage';

interface Product {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  strain: string;
  category: string;
  imageUrl: string;
  inventory: number;
  inStock: number;
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const skip = (currentPage - 1) * perPage;
  const { data, loading, error, refetch } = useQuery<ProductsData>(GET_PRODUCTS, {
    variables: { skip, take: perPage },
  });

  const products = data?.products || [];
  const totalCount = data?.productsCount || 0;
  const totalPages = Math.ceil(totalCount / perPage);

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (error) {
    return <ErrorMessage message="Failed to load products." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: perPage > 8 ? 8 : perPage }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No products available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                priceMin={product.priceMin || 0}
                priceMax={product.priceMax || 0}
                strain={product.strain || ''}
                category={product.category || ''}
                imageUrl={product.imageUrl || ''}
                inventory={product.inventory || 0}
                inStock={product.inStock || 0}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              perPage={perPage}
              onPageChange={setCurrentPage}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
