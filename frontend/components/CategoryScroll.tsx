'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, Category } from '@/lib/api';

// Mapping category names to emoji icons
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  // Pakaian / Clothing
  if (name.includes('shirt') || name.includes('t-shirt') || name.includes('kaos')) return '👕';
  if (name.includes('jacket') || name.includes('jaket')) return '🧥';
  if (name.includes('jeans') || name.includes('pants') || name.includes('celana')) return '👖';
  if (name.includes('dress') || name.includes('gaun')) return '👗';
  if (name.includes('skirt') || name.includes('rok')) return '👚';
  if (name.includes('sweater') || name.includes('hoodie')) return '🧶';
  if (name.includes('coat') || name.includes('mantel')) return '🧥';
  if (name.includes('suit') || name.includes('jas')) return '🤵';
  if (name.includes('underwear') || name.includes('dalam')) return '🩲';
  if (name.includes('sock') || name.includes('kaos kaki')) return '🧦';

  // Aksesoris / Accessories
  if (name.includes('bag') || name.includes('tas')) return '👜';
  if (name.includes('shoe') || name.includes('sepatu')) return '👟';
  if (name.includes('sandal') || name.includes('sendal')) return '🩴';
  if (name.includes('boot')) return '🥾';
  if (name.includes('watch') || name.includes('jam')) return '⌚';
  if (name.includes('cap') || name.includes('hat') || name.includes('topi')) return '🧢';
  if (name.includes('glasses') || name.includes('sunglass') || name.includes('kacamata')) return '🕶️';
  if (name.includes('belt') || name.includes('ikat pinggang')) return '👔';
  if (name.includes('tie') || name.includes('dasi')) return '👔';
  if (name.includes('scarf') || name.includes('syal')) return '🧣';
  if (name.includes('glove') || name.includes('sarung tangan')) return '🧤';
  if (name.includes('jewelry') || name.includes('perhiasan')) return '💍';
  if (name.includes('necklace') || name.includes('kalung')) return '📿';
  if (name.includes('ring') || name.includes('cincin')) return '💍';
  if (name.includes('wallet') || name.includes('dompet')) return '👛';

  // Elektronik / Electronics
  if (name.includes('phone') || name.includes('hp') || name.includes('smartphone')) return '📱';
  if (name.includes('laptop') || name.includes('notebook')) return '💻';
  if (name.includes('computer') || name.includes('pc') || name.includes('komputer')) return '🖥️';
  if (name.includes('tablet') || name.includes('ipad')) return '📱';
  if (name.includes('camera') || name.includes('kamera')) return '📷';
  if (name.includes('headphone') || name.includes('earphone')) return '🎧';
  if (name.includes('speaker') || name.includes('audio')) return '🔊';
  if (name.includes('tv') || name.includes('television')) return '📺';
  if (name.includes('game') || name.includes('console') || name.includes('gaming')) return '🎮';
  if (name.includes('keyboard') || name.includes('mouse')) return '⌨️';
  if (name.includes('charger') || name.includes('cable')) return '🔌';

  // Olahraga / Sports
  if (name.includes('sport') || name.includes('olahraga')) return '⛹️';
  if (name.includes('gym') || name.includes('fitness')) return '🏋️';
  if (name.includes('yoga')) return '🧘';
  if (name.includes('ball') || name.includes('bola')) return '⚽';
  if (name.includes('bicycle') || name.includes('sepeda')) return '🚴';
  if (name.includes('swim') || name.includes('renang')) return '🏊';

  // Rumah / Home
  if (name.includes('furniture') || name.includes('furnitur')) return '🪑';
  if (name.includes('bed') || name.includes('kasur')) return '🛏️';
  if (name.includes('lamp') || name.includes('lampu')) return '💡';
  if (name.includes('kitchen') || name.includes('dapur')) return '🍳';
  if (name.includes('tool') || name.includes('alat')) return '🔧';
  if (name.includes('garden') || name.includes('taman')) return '🌱';
  if (name.includes('decor') || name.includes('dekorasi')) return '🖼️';

  // Kecantikan / Beauty
  if (name.includes('beauty') || name.includes('kecantikan')) return '💄';
  if (name.includes('makeup') || name.includes('kosmetik')) return '💅';
  if (name.includes('skincare') || name.includes('perawatan')) return '🧴';
  if (name.includes('perfume') || name.includes('parfum')) return '🌸';
  if (name.includes('hair') || name.includes('rambut')) return '💇';

  // Makanan / Food
  if (name.includes('food') || name.includes('makanan')) return '🍔';
  if (name.includes('drink') || name.includes('minuman')) return '🥤';
  if (name.includes('snack') || name.includes('cemilan')) return '🍿';
  if (name.includes('coffee') || name.includes('kopi')) return '☕';

  // Buku / Books
  if (name.includes('book') || name.includes('buku')) return '📚';
  if (name.includes('magazine') || name.includes('majalah')) return '📖';
  if (name.includes('stationery') || name.includes('alat tulis')) return '✏️';

  // Anak / Kids
  if (name.includes('kids') || name.includes('anak') || name.includes('children')) return '👶';
  if (name.includes('toy') || name.includes('mainan')) return '🧸';
  if (name.includes('baby') || name.includes('bayi')) return '👶';

  // Lainnya / Others
  if (name.includes('accessories')) return '🕶️';
  if (name.includes('pet') || name.includes('hewan')) return '🐾';
  if (name.includes('automotive') || name.includes('otomotif')) return '🚗';
  if (name.includes('travel') || name.includes('perjalanan')) return '✈️';

  // Default icon for other categories
  return '🏷️';
};

export default function CategoryScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollCat = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280 * dir, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white py-4 border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-center gap-3">
        <button
          onClick={() => scrollCat(-1)}
          className="hidden md:flex flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 bg-white items-center justify-center cursor-pointer transition-all duration-150 text-slate-600 hover:bg-gray-50 hover:text-gray-900"
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          className="flex justify-center gap-5 md:gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth flex-1 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="min-h-[80px] flex flex-col items-center gap-1.5 flex-shrink-0 px-2 py-1"
              >
                <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category_id=${cat.id}`}
                className="min-h-[80px] flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 snap-start px-2 py-1 transition-opacity duration-150 hover:opacity-70"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-[22px] transition-colors duration-150 hover:bg-gray-200">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))
          )}
        </div>

        <button
          onClick={() => scrollCat(1)}
          className="hidden md:flex flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 bg-white items-center justify-center cursor-pointer transition-all duration-150 text-slate-600 hover:bg-gray-50 hover:text-gray-900"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
}
