'use client';

import { useRef } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  icon: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: string;
}

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.product-carousel-card')?.clientWidth || 220;
      scrollRef.current.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => scrollCarousel(-1)}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-[0_1px_2px_0_rgb(17_24_39_/_0.08),_0_1px_3px_0_rgb(17_24_39_/_0.12)] items-center justify-center text-slate-600 z-[5] transition-all duration-150 cursor-pointer hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
        aria-label="Previous"
      >
        ‹
      </button>

      <button
        onClick={() => scrollCarousel(1)}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-[0_1px_2px_0_rgb(17_24_39_/_0.08),_0_1px_3px_0_rgb(17_24_39_/_0.12)] items-center justify-center text-slate-600 z-[5] transition-all duration-150 cursor-pointer hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
        aria-label="Next"
      >
        ›
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-1 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="product-carousel-card min-w-[220px] flex-shrink-0 snap-start"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-150 hover:shadow-[0_4px_16px_rgb(17_24_39_/_0.12)] cursor-pointer relative group">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 transition-all duration-150 hover:text-red-600 hover:border-red-600 z-10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>

              <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-[64px] mb-3">
                {product.icon}
              </div>

              <div>
                <div className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                  {product.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600 mb-2">
                  <span className="text-amber-500">★</span>
                  {product.rating} <span className="text-slate-400">· {product.sold} Sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-600">
                    Rp{product.price.toLocaleString('id-ID')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      Rp{product.originalPrice.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
