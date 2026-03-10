'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { SUBMIT_ORDER, GET_PRODUCTS } from '@/lib/graphql/queries';
import { useCart } from '@/context/CartContext';

function formatPrice(min: number, max: number) {
  if (min === max) return `$${min}`;
  return `$${min} - $${max}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [submitOrder, { loading }] = useMutation(SUBMIT_ORDER, {
    refetchQueries: [{ query: GET_PRODUCTS, variables: { skip: 0, take: 25 } }],
  });

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      const { data } = await submitOrder({
        variables: {
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      });

      const result = data?.submitOrder;
      if (result?.success) {
        // Save order summary to sessionStorage for confirmation page
        sessionStorage.setItem(
          'gmc-order-confirmation',
          JSON.stringify({
            orderId: result.orderId,
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              priceMin: item.priceMin,
              priceMax: item.priceMax,
            })),
          })
        );
        clearCart();
        router.push('/order-confirmation');
      } else {
        setErrorMsg(result?.message || 'Order failed. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.productId} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} lb</p>
                </div>
                <p className="text-sm text-gray-700">
                  {formatPrice(item.priceMin, item.priceMax)}/lb
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Exact pricing will be confirmed by our team after order submission.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-700 hover:bg-green-800'
          }`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
