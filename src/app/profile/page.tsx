'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Static user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Commerce Street, City, State 12345',
    joinDate: 'January 2023',
    totalOrders: 12,
    totalSpent: 2847.50,
    favoriteItems: 8
  });

  const [editData, setEditData] = useState(userData);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'favorites', name: 'Favorites', icon: HeartIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  const recentOrders = [
    { id: 1, date: '2024-01-15', total: 299.99, status: 'Delivered', items: 2 },
    { id: 2, date: '2024-01-10', total: 149.99, status: 'Shipped', items: 1 },
    { id: 3, date: '2024-01-05', total: 599.98, status: 'Processing', items: 3 }
  ];

  const favoriteItems = [
    { id: 1, name: 'Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    { id: 2, name: 'Smart Watch', price: 399.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
    { id: 3, name: 'Gaming Keyboard', price: 199.99, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop' }
  ];

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
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-xl text-white/80">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{userData.name}</h3>
                <p className="text-white/60">Member since {userData.joinDate}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {activeTab === 'profile' && (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-colors duration-200"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 glass text-white hover:bg-white/20 rounded-xl transition-colors duration-200"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 px-4 py-3 glass rounded-xl">
                        <UserIcon className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{userData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 px-4 py-3 glass rounded-xl">
                        <EnvelopeIcon className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{userData.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 px-4 py-3 glass rounded-xl">
                        <PhoneIcon className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{userData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="flex items-start space-x-3 px-4 py-3 glass rounded-xl">
                        <MapPinIcon className="w-5 h-5 text-purple-400 mt-1" />
                        <span className="text-white">{userData.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {userData.totalOrders}
                    </div>
                    <div className="text-white/80">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      ${userData.totalSpent}
                    </div>
                    <div className="text-white/80">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {userData.favoriteItems}
                    </div>
                    <div className="text-white/80">Favorite Items</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8">Order History</h2>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="glass rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                          <p className="text-white/60">Date: {order.date}</p>
                          <p className="text-white/60">{order.items} items</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold gradient-text">${order.total}</div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'Delivered' 
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'Shipped'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8">Favorite Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteItems.map((item) => (
                    <div key={item.id} className="glass rounded-xl p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                      <div className="text-xl font-bold gradient-text">${item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-white/80">Email notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-white/80">SMS notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-white/80">Push notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-white/80">Make profile public</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-white/80">Show purchase history</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
