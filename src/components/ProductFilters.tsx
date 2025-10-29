'use client';

import { motion } from 'framer-motion';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductFilters = ({ isOpen, onClose }: ProductFiltersProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="glass rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 glass rounded-lg hover:bg-white/20 transition-colors duration-200"
          >
            <FunnelIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 px-3 py-2 glass rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Max"
                className="flex-1 px-3 py-2 glass rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Rating
            </label>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white/80">{rating}+ stars</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 glass text-white font-semibold rounded-xl hover:bg-white/20 transition-colors duration-200"
          >
            Apply Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Clear All
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductFilters;

