'use client';

import { useRef } from 'react';
import HomeProductCard from './HomeProductCard';

interface HomeProduct {
  id: number;
  name: string;
  icon: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: string;
}

interface HomeProductCarouselProps {
  products: HomeProduct[];
}

export default function HomeProductCarousel({ products }: HomeProductCarouselProps) {
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
          <div
            key={product.id}
            className="product-carousel-card min-w-[220px] flex-shrink-0 snap-start"
          >
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
