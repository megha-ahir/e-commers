'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { ShoppingCartIcon as ShoppingCartOutline } from '@heroicons/react/24/outline';
import { getTrendingProducts, Product } from '@/lib/api';

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getTrendingProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Trending</span> Products
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover our most popular items that everyone&apos;s talking about
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute top-2 right-2 glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ShoppingCartOutline className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400 font-medium">
                    {product.category || 'General'}
                  </span>
                  {/* <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white/80">{product. || 0}</span>
                  </div> */}
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">
                    ${product.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 glass rounded-lg hover:bg-white/20 transition-colors duration-300"
                  >
                    <ShoppingCartIcon className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
