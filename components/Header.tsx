'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-green-200 transition-colors">
          Green Mountain
        </Link>
        <Link href="/cart" className="flex items-center gap-2 hover:text-green-200 transition-colors">
          Cart
          {totalItems > 0 && (
            <span className="bg-white text-green-800 rounded-full px-2 py-0.5 text-sm font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
