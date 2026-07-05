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

interface HomeProductGridProps {
  products: HomeProduct[];
}

export default function HomeProductGrid({ products }: HomeProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
      {products.map((product) => (
        <HomeProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
