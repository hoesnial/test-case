'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { createOrder } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotal } = useCart();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`;
      const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const orderData = {
        customer_name: customerName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_postal_code: formData.postalCode,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData, idempotencyKey);

      console.log('Order created successfully:', response);

      toast.success('Order placed successfully! Redirecting...');

      clearCart();

      // Use window.location for more reliable navigation
      setTimeout(() => {
        window.location.href = `/order-success/${response.id}`;
      }, 1500);
    } catch (err) {
      console.error('Order creation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getTotal();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-light font-sans text-gray-900 mb-6">
                Checkout
              </h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-600 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-8">
                <h2 className="text-xl font-normal font-sans text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                        formErrors.firstName ? 'border-red-600' : 'border-gray-200'
                      }`}
                      placeholder="John"
                    />
                    {formErrors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                        formErrors.lastName ? 'border-red-600' : 'border-gray-200'
                      }`}
                      placeholder="Doe"
                    />
                    {formErrors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                      formErrors.email ? 'border-red-600' : 'border-gray-200'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                      formErrors.phone ? 'border-red-600' : 'border-gray-200'
                    }`}
                    placeholder="+62 812-3456-7890"
                  />
                  {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                      formErrors.address ? 'border-red-600' : 'border-gray-200'
                    }`}
                    placeholder="Jl. Contoh No. 123"
                  />
                  {formErrors.address && <p className="text-xs text-red-600 mt-1">{formErrors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                        formErrors.city ? 'border-red-600' : 'border-gray-200'
                      }`}
                      placeholder="Jakarta"
                    />
                    {formErrors.city && <p className="text-xs text-red-600 mt-1">{formErrors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-900 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white ${
                        formErrors.postalCode ? 'border-red-600' : 'border-gray-200'
                      }`}
                      placeholder="12345"
                    />
                    {formErrors.postalCode && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>

          <div className="sticky top-20 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-normal font-sans text-gray-900 mb-4 pb-4 border-b border-gray-200">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-gray-900">Rp{total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-semibold pt-4 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">Rp{total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
