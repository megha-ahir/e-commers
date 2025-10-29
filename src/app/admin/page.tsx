'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { adminListProducts } from '@/lib/api';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  totalValue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminListProducts().then((products) => {
      const mapped = products.map((p: any) => ({
        ...p,
        status: (p.stock ?? 0) > 0 ? 'active' : 'inactive',
      }));
      setStats({
        totalProducts: mapped.length,
        activeProducts: mapped.filter((p) => p.status === 'active').length,
        totalStock: mapped.reduce((sum, p) => sum + (p.stock ?? 0), 0),
        totalValue: mapped.reduce(
          (sum, p) => sum + (p.price ?? 0) * (p.stock ?? 0),
          0
        ),
      });
    });
  }, []);

  if (!stats) return <p className="text-white/70">Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-3xl font-bold gradient-text mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <p className="text-white/80 text-sm">Total Products</p>
          <p className="text-3xl font-bold gradient-text">{stats.totalProducts}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-white/80 text-sm">Active Products</p>
          <p className="text-3xl font-bold gradient-text">{stats.activeProducts}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-white/80 text-sm">Total Stock</p>
          <p className="text-3xl font-bold gradient-text">{stats.totalStock}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-white/80 text-sm">Total Value</p>
          <p className="text-3xl font-bold gradient-text">
            ${stats.totalValue.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
