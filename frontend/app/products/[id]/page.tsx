'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { getProduct, Product } from '@/lib/api';
import { useCart } from '@/lib/cart-context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const productId = typeof params.id === 'string' ? parseInt(params.id, 10) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    if (!product) return;
    const newQty = Math.max(1, Math.min(value, product.stock));
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      addItem(
        {
          product_id: product.id,
          name: product.name,
          price: parseFloat(String(product.price)),
          image_url: product.image_url || '',
          stock: product.stock,
        },
        quantity
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      addItem(
        {
          product_id: product.id,
          name: product.name,
          price: parseFloat(String(product.price)),
          image_url: product.image_url || '',
          stock: product.stock,
        },
        quantity
      );
      router.push('/cart');
    } finally {
      setIsAdding(false);
    }
  };

  const stockStatus = product?.stock
    ? product.stock > 10
      ? 'In Stock'
      : product.stock > 0
      ? 'Low Stock'
      : 'Out of Stock'
    : 'Out of Stock';

  const stockVariant = product?.stock
    ? product.stock > 10
      ? 'success'
      : product.stock > 0
      ? 'warning'
      : 'danger'
    : 'danger';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-100 rounded-md w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-100 rounded-lg aspect-square" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-100 rounded-md w-3/4" />
                <div className="h-6 bg-gray-100 rounded-md w-1/4" />
                <div className="h-20 bg-gray-100 rounded-md" />
                <div className="h-10 bg-gray-100 rounded-md w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold font-sans text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-slate-600 text-base mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/catalog">
            <Button variant="primary">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6 pb-4 border-b border-gray-200">
          <Link href="/catalog" className="hover:text-emerald-600 transition-colors duration-150">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">📦</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-sans text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold font-sans text-gray-900">
                  Rp{parseFloat(String(product.price)).toLocaleString('id-ID')}
                </span>
                <Badge variant={stockVariant}>{stockStatus}</Badge>
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-semibold text-gray-900">
                Qty
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                className="w-20 text-center px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-gray-900 bg-white"
                disabled={product.stock === 0}
              />
              <span className="text-xs text-slate-600">
                stock: <strong className="text-gray-900">{product.stock}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                variant="primary"
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isAdding}
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Product Specifications */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                Product Specifications
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm font-medium text-slate-600 bg-gray-50 w-1/3">
                        Product ID
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.id}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm font-medium text-slate-600 bg-gray-50">
                        Category
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.category?.name || 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm font-medium text-slate-600 bg-gray-50">
                        Stock
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.stock} units</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-600 bg-gray-50">
                        Availability
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{stockStatus}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
