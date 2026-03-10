'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderSummary {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    priceMin: number;
    priceMax: number;
  }>;
}

function formatPrice(min: number, max: number) {
  if (min === max) return `$${min}`;
  return `$${min} - $${max}`;
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('gmc-order-confirmation');
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        // ignore
      }
      sessionStorage.removeItem('gmc-order-confirmation');
    }
  }, []);

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h1>
        <p className="text-gray-600 mb-6">
          No recent order information available.
        </p>
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
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-green-600 text-5xl mb-4">&#10003;</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-6">
          Order ID: <span className="font-mono text-gray-900">{order.orderId}</span>
        </p>

        <div className="text-left border-t pt-4 mt-4">
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Name:</span> {order.customerName}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Email:</span> {order.customerEmail}
          </p>

          <div className="divide-y">
            {order.items.map((item, i) => (
              <div key={i} className="py-2 flex justify-between text-sm">
                <span>
                  {item.name} &mdash; {item.quantity} lb
                </span>
                <span className="text-gray-600">{formatPrice(item.priceMin, item.priceMax)}/lb</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600 mt-4">
            Our team will contact you to confirm exact pricing and arrange fulfillment.
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="inline-block mt-6 px-6 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
