'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Detect if current path is admin
  const isAdminPage = pathname.startsWith('/admin');

  // Links for admin
  const adminLinks = [
    { id: 'dashboard', name: 'DASHBOARD', href: '/admin' },
    { id: 'products', name: 'PRODUCTS', href: '/admin/products' },
    { id: 'users', name: 'USERS', href: '/admin/users' },
    { id: 'analytics', name: 'ANALYTICS', href: '/admin/analytics' },
  ];

  // Links for normal users
  const userLinks = [
    { id: 'home', name: 'HOME', href: '/' },
    { id: 'products', name: 'PRODUCTS', href: '/products' },
    { id: 'cart', name: 'CART', href: '/cart' },
    { id: 'profile', name: 'PROFILE', href: '/profile' },
  ];

  // Choose which set to render
  const links = isAdminPage ? adminLinks : userLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <Link
          href={isAdminPage ? '/admin/dashboard' : '/'}
          className="text-2xl font-bold gradient-text"
        >
          {isAdminPage ? 'Admin Panel' : 'E-Commerce'}
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link, id) => (
            <Link
              key={id}
              href={link.href}
              onClick={() => setActiveTab(link.id)}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${activeTab === link.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
