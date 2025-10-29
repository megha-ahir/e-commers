'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop",
      count: "120+ Products",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop",
      count: "85+ Products",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      name: "Gaming",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop",
      count: "65+ Products",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      name: "Home & Garden",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      count: "95+ Products",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
      count: "70+ Products",
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 6,
      name: "Books",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
      count: "150+ Products",
      color: "from-indigo-500 to-purple-600"
    }
  ];

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
            Shop by <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our wide range of product categories to find exactly what you&apos;re looking for
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link href={`/products?category=${category.name.toLowerCase()}`}>
                <div className="glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                  <div className="relative h-64">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.count}
                      </p>
                    </div>
                    <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Categories;
