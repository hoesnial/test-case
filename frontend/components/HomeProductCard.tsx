import Link from 'next/link';

interface HomeProduct {
  id: number;
  name: string;
  icon: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: string;
}

interface HomeProductCardProps {
  product: HomeProduct;
}

export default function HomeProductCard({ product }: HomeProductCardProps) {
  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <span className="text-[64px] group-hover:scale-105 transition-transform duration-300">
            {product.icon}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
