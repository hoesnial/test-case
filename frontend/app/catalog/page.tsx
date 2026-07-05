'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { getCategories, getProducts, Category, Product } from '@/lib/api';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'best';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Read category_id from URL on mount
  useEffect(() => {
    const categoryIdParam = searchParams.get('category_id');
    if (categoryIdParam) {
      const categoryId = parseInt(categoryIdParam, 10);
      if (!isNaN(categoryId)) {
        setSelectedCategory(categoryId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts({ limit: 100 }),
        ]);
        setCategories(categoriesData);
        setProducts(productsData.data);
        setFilteredProducts(productsData.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== null) {
      filtered = filtered.filter((product) => product.category_id === selectedCategory);
    }

    filtered = sortProducts(filtered, sortBy);
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const sortProducts = (productList: Product[], sort: SortOption): Product[] => {
    const sorted = [...productList];

    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price)));
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(String(b.price)) - parseFloat(String(a.price)));
      case 'best':
        return sorted.sort((a, b) => b.stock - a.stock);
      case 'newest':
      default:
        return sorted.sort((a, b) => b.id - a.id);
    }
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'newest':
        return 'Newest';
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'best':
        return 'Best Selling';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header hideSearch={true} />

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-gray-900"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === null
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              All
            </button>
            {(showAllCategories ? categories : categories.slice(0, 12)).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {category.name}
              </button>
            ))}

            {/* Show More/Less Button */}
            {categories.length > 12 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                {showAllCategories ? (
                  <span className="flex items-center gap-1">
                    Show Less
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    Show More ({categories.length - 12})
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-5 text-sm text-gray-500">
          Showing <strong className="text-gray-900">{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header hideSearch={true} />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-2 mb-6">
              <div className="h-8 bg-gray-200 rounded-full w-20"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
