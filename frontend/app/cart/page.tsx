'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number, stock: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      const clampedQty = Math.min(newQuantity, stock);
      updateQuantity(productId, clampedQty);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const total = getTotal();
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-600 mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-sans text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 text-base mb-8">
              Start adding items to your cart and they will appear here.
            </p>
            <Link href="/catalog">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-baseline mb-8">
          <h1 className="text-3xl font-bold font-sans text-gray-900">
            Shopping Cart
          </h1>
          <span className="text-sm text-slate-600">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Cart Items */}
          <div className="space-y-3">
            {items.map((item) => {
              const subtotal = item.price * item.quantity;
              return (
                <div
                  key={item.product_id}
                  className="grid grid-cols-[64px_1fr_auto_auto_auto] gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg transition-colors duration-150 hover:border-slate-300"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="font-medium text-gray-900 hover:text-emerald-600 transition-colors duration-150 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-600 mt-1">
                      Rp{item.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product_id,
                          parseInt(e.target.value, 10) || 1,
                          item.stock
                        )
                      }
                      className="w-16 text-center px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-gray-900 bg-white"
                      aria-label={`Quantity for ${item.name}`}
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="text-right font-medium text-gray-900 whitespace-nowrap">
                    Rp{subtotal.toLocaleString('id-ID')}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-slate-600 hover:text-red-600 transition-colors duration-150 p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <button
                onClick={handleClearCart}
                className="text-sm text-slate-600 hover:text-red-600 transition-colors duration-150"
              >
                Clear Cart
              </button>
            </div>

            {/* Continue Shopping Link */}
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-gray-900 transition-colors duration-150"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="sticky top-20 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-normal font-sans text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-base">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  Rp{total.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-semibold pt-4 border-t border-gray-200 mb-6">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">Rp{total.toLocaleString('id-ID')}</span>
            </div>

            <Button
              variant="primary"
              onClick={handleCheckout}
              className="w-full"
            >
              Proceed to Checkout
            </Button>

            <p className="text-xs text-slate-600 text-center mt-4">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
