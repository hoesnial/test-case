'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { getOrder, Order } from '@/lib/api';

export default function OrderSuccessPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = typeof params.orderId === 'string' ? parseInt(params.orderId, 10) : null;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || isNaN(orderId)) {
        setError('Invalid order ID');
        setIsLoading(false);
        return;
      }

      console.log('Fetching order:', orderId);
      setIsLoading(true);
      try {
        const data = await getOrder(orderId);
        console.log('Order fetched successfully:', data);
        setOrder(data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Order not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6" />
            <div className="h-8 bg-gray-100 rounded-md w-64 mx-auto" />
            <div className="h-6 bg-gray-100 rounded-md w-96 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-sans text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-slate-600 text-base mb-8">
            We couldn't find the order you're looking for. It may have been removed or the link is incorrect.
          </p>
          <Link href="/catalog">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 className="text-3xl font-light font-sans text-gray-900 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-600 text-base mb-6 max-w-md">
            Thank you for your order. We'll send you a confirmation email with tracking details once your order ships.
          </p>

          <div className="inline-block bg-green-50 text-green-600 font-mono text-sm px-4 py-2 rounded-full mb-8">
            Order #{order.order_number}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-lg font-medium font-sans text-gray-900 mb-4 pb-3 border-b border-gray-200">
            Order Summary
          </h2>

          <div className="space-y-3 mb-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-900">{item.product_name}</p>
                  <p className="text-xs text-slate-600">
                    Qty: {item.quantity} × Rp{parseFloat(String(item.unit_price)).toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  Rp{parseFloat(String(item.subtotal)).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                Rp{parseFloat(String(order.total)).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-semibold pt-3 mt-3 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">Rp{parseFloat(String(order.total)).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-lg font-medium font-sans text-gray-900 mb-4">
            Shipping Information
          </h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-medium text-gray-900">{order.customer_name}</p>
            <p>{order.customer_email}</p>
            {order.customer_phone && <p>{order.customer_phone}</p>}
            <p className="pt-2">{order.shipping_address}</p>
            {order.shipping_city && order.shipping_postal_code && (
              <p>
                {order.shipping_city}, {order.shipping_postal_code}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalog">
            <Button variant="primary" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Order placed on {new Date(order.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
