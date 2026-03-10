'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

function formatPrice(min: number, max: number) {
  if (min === max) return `$${min}`;
  return `$${min} - $${max}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-6">Your cart is empty.</p>
        <Link
          href="/"
          className="px-6 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow-sm border divide-y">
        {items.map((item) => (
          <div key={item.productId} className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.strain}</p>
              <p className="text-sm text-green-700 font-medium">
                {formatPrice(item.priceMin, item.priceMax)}/lb
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="text-gray-500 w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-gray-500 w-12 text-center text-sm font-medium">{item.quantity} lb</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                disabled={item.quantity >= item.inventory}
                className="text-gray-500 w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-xs text-gray-600">/ {item.inventory}</span>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-green-700 hover:underline">
          Continue Shopping
        </Link>
        <Link
          href="/checkout"
          className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
