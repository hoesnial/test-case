'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders, Order } from '@/lib/api';
import { useToast } from '@/lib/toast-context';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getOrders({ limit: 100 });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded-md w-48" />
          <div className="h-64 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sans text-gray-900">
            Orders
          </h1>
          <Link href="/admin" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-150">
            ← Back to Dashboard
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <p className="text-slate-600">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        #{order.order_number}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {order.customer_email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Rp{parseFloat(String(order.total)).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold uppercase">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-150"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-sans text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-600 hover:text-gray-900 transition-colors duration-150"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      Order Number
                    </h3>
                    <p className="font-mono text-gray-900">#{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      Status
                    </h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold uppercase">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {selectedOrder.customer_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {selectedOrder.customer_email}
                    </p>
                    {selectedOrder.customer_phone && (
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> {selectedOrder.customer_phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm">{selectedOrder.shipping_address}</p>
                    {selectedOrder.shipping_city && selectedOrder.shipping_postal_code && (
                      <p className="text-sm">
                        {selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}
                      </p>
                    )}
                  </div>
                </div>

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      Order Items
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-slate-600">
                              Qty: {item.quantity} × Rp{parseFloat(String(item.unit_price)).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            Rp{parseFloat(String(item.subtotal)).toLocaleString('id-ID')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>Rp{parseFloat(String(selectedOrder.total)).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  Order placed on{' '}
                  {new Date(selectedOrder.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
