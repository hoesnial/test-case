'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getOrders, Product, Order } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function AdminDashboardPage() {
  const { signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, ordersData] = await Promise.all([
          getProducts({ limit: 100 }),
          getOrders({ limit: 10 }),
        ]);
        setProducts(productsData.data);
        setOrders(ordersData.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(String(order.total)), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-100 rounded-md w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900 mb-1">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600">Welcome to MiniShop Admin</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold font-sans text-gray-900 mb-1">
              {totalOrders}
            </div>
            <div className="text-sm text-slate-600">Total Orders</div>
          </div>

          {/* Total Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold font-sans text-gray-900 mb-1">
              {totalProducts}
            </div>
            <div className="text-sm text-slate-600">Total Products</div>
          </div>

          {/* Revenue */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold font-sans text-gray-900 mb-1">
              Rp{Math.round(totalRevenue / 1000)}k
            </div>
            <div className="text-sm text-slate-600">Total Revenue</div>
          </div>

          {/* Low Stock */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold font-sans text-gray-900 mb-1">
              {lowStockProducts.length}
            </div>
            <div className="text-sm text-slate-600">Low Stock Items</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Recent Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold font-sans text-gray-900">
                Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-150">
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-center py-8 text-slate-600">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">#{order.order_number}</p>
                      <p className="text-sm text-slate-600">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        Rp{parseFloat(String(order.total)).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-slate-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold font-sans text-gray-900">
                Low Stock Alert
              </h2>
              <Link href="/admin/products" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-150">
                Manage
              </Link>
            </div>

            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <p className="text-center py-8 text-slate-600">All products in stock</p>
            ) : (
              <div className="space-y-3">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center text-sm">
                        {product.image_url ? '📦' : '📦'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-600">Stock: {product.stock}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                      product.stock === 0
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {product.stock === 0 ? 'Out' : 'Low'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-150 font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path>
            </svg>
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-150 font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            View Orders
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-150 font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            View Store
          </Link>
        </div>
      </div>
    </div>
  );
}
