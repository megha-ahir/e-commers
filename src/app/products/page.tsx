'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ProductCard';
import { listProducts, Product } from '@/lib/api';

// Use Omit to safely redefine UI-only fields
type UIProduct = Omit<Product, 'description' | 'name'> & {
  name?: string;
  description?: string;
  rating?: number;
  image?: string;
  inStock?: boolean;
};

const ProductsPage = () => {
  const categories = ['all', 'electronics', 'fashion', 'gaming', 'home', 'sports', 'books'];
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch and map products
  useEffect(() => {
    listProducts()
      .then((data) => {
        const mapped: UIProduct[] = data.map((p) => ({
          ...p,
          // safe defaults for UI
          image: (p as any).image || (p as any).images?.[0] || 'https://via.placeholder.com/500',
          rating: 4.5,
          description: (p as any).description ?? '',
          inStock: (p as any).stock ? (p as any).stock > 0 : false,
          category: (p as any).category || 'general',
          price: (p as any).price ?? 0,
          title: (p as any).title || (p as any).name || 'Product',
          name: (p as any).name ?? (p as any).title ?? 'Product',
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]));
  }, []);

  // Filter + sort logic
  const filteredProducts = products
    .filter((product) => {
      const name = (product.name ?? '').toLowerCase();
      const description = (product.description ?? '').toLowerCase();

      // Category filter
      if (
        selectedCategory !== 'all' &&
        (product.category ?? '').toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!name.includes(term) && !description.includes(term)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const nameA = a.name ?? '';
      const nameB = b.name ?? '';

      switch (sortBy) {
        case 'price-low':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'price-high':
          return (b.price ?? 0) - (a.price ?? 0);
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return nameA.localeCompare(nameB);
      }
    });

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover our complete collection of premium products
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 glass rounded-xl text-white hover:bg-white/20 transition-colors duration-200 flex items-center space-x-2"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={(product._id as string) || String(index)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
              <p className="text-white/80 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 glass rounded-xl text-white hover:bg-white/20 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
