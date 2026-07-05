'use client';

import { useState, useEffect, useRef } from 'react';

const slides = [
  { id: 1, image: '/hero-1.webp', alt: 'Hero 1' },
  { id: 2, image: '/hero-2.webp', alt: 'Hero 2' },
  { id: 3, image: '/hero-3.webp', alt: 'Hero 3' },
  { id: 4, image: '/hero-4.webp', alt: 'Hero 4' },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDist, setDragDist] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const totalSlides = slides.length;

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
  };

  const resetAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slideHero = (dir: number) => {
    setCurrentSlide((prev) => (prev + dir + totalSlides) % totalSlides);
    resetAutoPlay();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoPlay();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
    setDragDist(0);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    setDragDist(dx);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s ease';
    }
    if (Math.abs(dragDist) > 60) {
      slideHero(dragDist < 0 ? 1 : -1);
    }
    setDragDist(0);
  };

  const getTransform = () => {
    const baseTransform = -currentSlide * 100;
    if (isDragging && trackRef.current) {
      const containerWidth = trackRef.current.parentElement?.offsetWidth || 1;
      const dragPercent = (dragDist / containerWidth) * 100;
      return `translateX(calc(${baseTransform}% + ${dragDist}px))`;
    }
    return `translateX(${baseTransform}%)`;
  };

  return (
    <div
      className="relative overflow-hidden bg-gray-100"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: getTransform() }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full flex-shrink-0 h-[200px] sm:h-[300px] lg:h-[400px] flex items-center justify-center overflow-hidden relative"
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-[2]">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-6 sm:w-[24px]'
                : 'bg-white/50 w-1.5 sm:w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => slideHero(-1)}
        className="absolute top-1/2 -translate-y-1/2 left-5 sm:left-2.5 md:left-5 z-[2] w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-black/8 flex items-center justify-center transition-all duration-300 shadow-[0_2px_12px_rgba(17,24,39,0.18)] text-gray-900 opacity-0 hover:opacity-100 focus-visible:opacity-100 hover:bg-white hover:scale-110 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] active:scale-95"
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={() => slideHero(1)}
        className="absolute top-1/2 -translate-y-1/2 right-5 sm:right-2.5 md:right-5 z-[2] w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-black/8 flex items-center justify-center transition-all duration-300 shadow-[0_2px_12px_rgba(17,24,39,0.18)] text-gray-900 opacity-0 hover:opacity-100 focus-visible:opacity-100 hover:bg-white hover:scale-110 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] active:scale-95"
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
