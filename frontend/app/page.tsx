'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryScroll from '@/components/CategoryScroll';
import { ProductGrid } from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { getProducts, Product } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await getProducts({ limit: 100 });
        setProducts(productsData.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const allProducts = products.slice(0, 6);
  const todaysProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Category Scroll */}
      <CategoryScroll />

      {/* All Products Section */}
      <div className="py-10 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">All Products</h2>
            <Link
              href="/catalog"
              className="flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-gray-900 transition-colors duration-150 whitespace-nowrap"
            >
              All Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
          <div className="relative">
            <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory py-1 scrollbar-hide">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-[180px] flex-shrink-0">
                    <div className="bg-gray-100 rounded-lg h-64 animate-pulse" />
                  </div>
                ))
              ) : (
                allProducts.map((product) => (
                  <div key={product.id} className="w-[180px] flex-shrink-0 snap-start">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <img src={`https://picsum.photos/seed/${product.name.toLowerCase().replace(/\s+/g, '-')}/400/400`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1.5 text-sm">{product.name}</h3>
                          <span className="text-base font-bold text-gray-900">Rp{product.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Todays For You Section */}
      <div className="py-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">Todays For You!</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button className="px-4 py-1.5 rounded-full text-[13px] font-semibold border border-emerald-600 bg-emerald-600 text-white whitespace-nowrap flex-shrink-0 transition-all duration-150">
                Best Seller
              </button>
              <button className="px-4 py-1.5 rounded-full text-[13px] font-semibold border border-slate-300 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-600 whitespace-nowrap flex-shrink-0 transition-all duration-150">
                Keep Stylish
              </button>
              <button className="px-4 py-1.5 rounded-full text-[13px] font-semibold border border-slate-300 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-600 whitespace-nowrap flex-shrink-0 transition-all duration-150">
                Special Discount
              </button>
              <button className="px-4 py-1.5 rounded-full text-[13px] font-semibold border border-slate-300 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-600 whitespace-nowrap flex-shrink-0 transition-all duration-150">
                Coveted Product
              </button>
            </div>
          </div>
          <ProductGrid products={todaysProducts} isLoading={isLoading} />
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-b from-emerald-700 to-emerald-900 py-15 px-4 text-center border-b border-white/10">
        <blockquote className="max-w-[640px] mx-auto text-[28px] font-[450] italic text-emerald-50 leading-[1.5]">
          "Let's Shop Beyond Boundaries — Temukan gaya terbaikmu hanya di MiniShop."
          <cite className="block mt-4 text-[13px] not-italic text-white/60">— MiniShop, 2024</cite>
        </blockquote>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
