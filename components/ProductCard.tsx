'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
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

function formatPrice(min: number, max: number) {
  if (min === max) return `$${min}`;
  return `$${min} - $${max}`;
}

export default function ProductCard({
  id,
  name,
  priceMin,
  priceMax,
  strain,
  category,
  imageUrl,
  inventory,
  inStock,
}: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const isOutOfStock = !inStock || inventory <= 0;
  const inCartQty = getItemQuantity(id);
  const remaining = inventory - inCartQty;
  const cartFull = remaining <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || cartFull) return;
    addItem({
      productId: id,
      name,
      priceMin,
      priceMax,
      quantity: 1,
      inventory,
      imageUrl,
      strain,
      category,
    });
  };

  return (
    <Link href={`/products/${id}`} className="block">
      <div
        className={`border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${
          isOutOfStock ? 'opacity-60' : ''
        }`}
      >
        <div className="relative aspect-square bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-green-700 font-bold mt-1">{formatPrice(priceMin, priceMax)}/lb</p>
          {strain && <p className="text-sm text-gray-600 mt-1">{strain}</p>}
          <p className="text-xs text-gray-600 mt-1">
            {isOutOfStock ? 'Out of stock' : `${inventory} lbs available`}
            {inCartQty > 0 && !isOutOfStock && ` (${inCartQty} in cart)`}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || cartFull}
            className={`mt-2 w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
              isOutOfStock || cartFull
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : cartFull ? 'Max in Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
