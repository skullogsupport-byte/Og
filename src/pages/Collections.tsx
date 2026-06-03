import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Filter } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'featured';

  const [isSortOpen, setIsSortOpen] = useState(false);

  const filtered = PRODUCTS.filter(p => categoryParam === 'All' || p.category === categoryParam);

  const sorted = [...filtered].sort((a, b) => {
    if (sortParam === 'low') return a.price - b.price;
    if (sortParam === 'high') return b.price - a.price;
    if (sortParam === 'newest') return b.id.localeCompare(a.id); // arbitrary mock sort
    return 0; // featured
  });

  const updateCategory = (cat: string) => {
    setSearchParams(prev => {
      prev.set('category', cat);
      return prev;
    });
  };

  const updateSort = (sort: string) => {
    setSearchParams(prev => {
      prev.set('sort', sort);
      return prev;
    });
    setIsSortOpen(false);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'low', label: 'Price: Low to High' },
    { value: 'high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortParam)?.label || 'Sort By';

  return (
    <div className="flex-1 bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="font-heading font-black italic uppercase text-4xl md:text-5xl tracking-tighter mb-4 text-center">
            {categoryParam === 'All' ? 'Complete Collection' : categoryParam}
          </h1>
          <p className="text-gray-500 max-w-2xl text-center">
            Discover our premium selection of {categoryParam === 'All' ? 'streetwear and sports fashion' : categoryParam.toLowerCase()}. Designed for performance, styled for the streets.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => updateCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                  categoryParam === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
            <span className="text-sm text-gray-500 font-medium">{sorted.length} Products</span>
            
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">{currentSortLabel}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-20"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateSort(option.value)}
                        className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors ${
                          sortParam === option.value ? 'text-skullog-red' : 'text-black'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {sorted.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-gray-400">No products found.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
            {sorted.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
