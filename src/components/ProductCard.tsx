'use client';

import { motion } from 'framer-motion';
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { addToCart } from '@/lib/api'; // ✅ Import your API

type Product = {
  id?: string | number;
  _id?: string;
  name?: string;
  title?: string;
  price: number;
  rating?: number;
  image?: string;
  images?: string[];
  category: string;
  description?: string;
  inStock?: boolean;
  stock?: number;
};

interface ProductCardProps {
  product: Product;
  userId?: string; // ✅ Optional (if you have user login)
}

const ProductCard = ({ product, userId = '68e94def7f4a944460bd3dc7' }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayId = (product.id ?? product._id) as string | number | undefined;
  const displayName = product.name ?? product.title ?? 'Product';
  const displayImage =
    product.image ||
    product.images?.[0] ||
    'https://via.placeholder.com/500';
  const displayRating = product.rating ?? 4.5;
  const available = product.inStock ?? ((product.stock ?? 0) > 0);

  // ✅ Handle Add to Cart (API Integration)
  const handleAddToCart = async () => {
    console.log(String(displayId));

    if (!available) {
      toast.error('Product is out of stock');
      return;
    }

    if (!displayId) {
      toast.error('Invalid product ID');
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(String(displayId), userId, 1);
      toast.success(`${displayName} added to cart!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={displayImage}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleLike}
            className="p-2 glass rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            {isLiked ? (
              <HeartIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutline className="w-5 h-5 text-white" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 glass rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <EyeIcon className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Stock Status */}
        {!available && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-500/90 text-white text-sm font-medium rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 glass text-white text-sm font-medium rounded-full">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/80">{displayRating}</span>
          </div>
          {displayId ? (
            <span className="text-sm text-white/60">ID: {displayId}</span>
          ) : null}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {displayName}
        </h3>

        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {product.description ?? ''}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold gradient-text">
              ${product.price}
            </span>
            <span className="text-sm text-white/60">per item</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={!available || isLoading}
            className={`p-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${available
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
              : 'glass text-white/50 cursor-not-allowed'
              }`}
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>
              {isLoading
                ? 'Adding...'
                : available
                  ? 'Add to Cart'
                  : 'Out of Stock'}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
