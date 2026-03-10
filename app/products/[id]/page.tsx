'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_PRODUCT } from '@/lib/graphql/queries';
import { useCart } from '@/context/CartContext';
import { ProductDetailSkeleton } from '@/components/Skeleton';
import ErrorMessage from '@/components/ErrorMessage';

function formatPrice(min: number, max: number) {
  if (min === max) return `$${min}`;
  return `$${min} - $${max}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  if (loading) {
    return (
      <div>
        <Link href="/" className="text-green-700 hover:underline mb-6 inline-block">
          &larr; Back to Products
        </Link>
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link href="/" className="text-green-700 hover:underline mb-6 inline-block">
          &larr; Back to Products
        </Link>
        <ErrorMessage message="Failed to load product." onRetry={() => refetch()} />
      </div>
    );
  }

  const product = data?.product;
  if (!product) {
    return (
      <div>
        <Link href="/" className="text-green-700 hover:underline mb-6 inline-block">
          &larr; Back to Products
        </Link>
        <p className="text-center text-gray-600 py-12">Product not found.</p>
      </div>
    );
  }

  const isOutOfStock = !product.inStock || product.inventory <= 0;
  const inCartQty = getItemQuantity(product.id);
  const remaining = Math.max(0, (product.inventory || 0) - inCartQty);
  const maxCanAdd = Math.floor(remaining);

  const handleAddToCart = () => {
    if (isOutOfStock || maxCanAdd <= 0) return;
    const qtyToAdd = Math.min(quantity, maxCanAdd);
    addItem({
      productId: product.id,
      name: product.name,
      priceMin: product.priceMin || 0,
      priceMax: product.priceMax || 0,
      quantity: qtyToAdd,
      inventory: product.inventory || 0,
      imageUrl: product.imageUrl || '',
      strain: product.strain || '',
      category: product.category || '',
    });
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <Link href="/" className="text-green-700 hover:underline mb-6 inline-block">
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl text-green-700 font-bold mt-2">
            {formatPrice(product.priceMin || 0, product.priceMax || 0)}/lb
          </p>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {product.strain && (
              <p>
                <span className="font-medium text-gray-900">Type:</span> {product.strain}
              </p>
            )}
            {product.potency && (
              <p>
                <span className="font-medium text-gray-900">Potency:</span> {product.potency}
              </p>
            )}
            {product.environment && (
              <p>
                <span className="font-medium text-gray-900">Environment:</span>{' '}
                {product.environment}
              </p>
            )}
            {product.category && (
              <p>
                <span className="font-medium text-gray-900">Category:</span> {product.category}
              </p>
            )}
            <p>
              <span className="font-medium text-gray-900">Available:</span>{' '}
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of Stock</span>
              ) : (
                <>
                  {product.inventory} lbs
                  {inCartQty > 0 && (
                    <span className="text-gray-600"> ({inCartQty} already in cart, {remaining} remaining)</span>
                  )}
                </>
              )}
            </p>
            {product.useByDate && (
              <p>
                <span className="font-medium text-gray-900">Use By:</span> {product.useByDate}
              </p>
            )}
          </div>

          {product.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>
          )}

          {!isOutOfStock && maxCanAdd > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="qty" className="text-sm font-medium text-gray-700">
                  Qty (lbs):
                </label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={maxCanAdd}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(val, maxCanAdd)));
                  }}
                  className="w-20 border rounded px-2 py-1 text-sm text-gray-900"
                />
                <span className="text-xs text-gray-600">max {maxCanAdd}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors"
              >
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          )}

          {!isOutOfStock && maxCanAdd <= 0 && (
            <div className="mt-6">
              <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded font-medium">
                Maximum quantity already in cart
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="mt-6">
              <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
