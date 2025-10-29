'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    adminListProducts,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
} from '@/lib/api';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
// import { ChartBarIcon, ShoppingBagIcon, UsersIcon, CurrencyDollarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// Match backend model
export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isTrending: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Frontend form type
interface NewProduct {
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    image: string;
    status: 'active' | 'inactive';
}

const ProductsPage = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'orders'>('products');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        status: 'active',
    });

    // Load products
    useEffect(() => {
        adminListProducts()
            .then((res) => setProducts(res))
            .catch(() => {
                toast.error('Failed to load products');
                setProducts([]);
            });
    }, []);

    // ✅ Add product
    const handleAddProduct = async () => {
        try {
            const created: Product = await adminCreateProduct({
                title: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                stock: parseInt(newProduct.stock) || 0,
                images: newProduct.image ? [newProduct.image] : [],
                isTrending: false,
            });

            setProducts([created, ...products]);
            toast.success('Product added successfully');
            setShowAddModal(false);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: '',
                status: 'active',
            });
        } catch (error) {
            toast.error('Error adding product');
        }
    };

    // ✅ Delete product (backend + state)
    const handleDeleteProduct = async (_id: string) => {
        try {
            await adminDeleteProduct(_id);
            setProducts((prev) => prev.filter((p) => p._id !== _id));
            toast.success('Product deleted');
        } catch {
            toast.error('Error deleting product');
        }
    };

    // ✅ Edit product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.title,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            stock: product.stock.toString(),
            image: product.images?.[0] || '',
            status: 'active',
        });
        setShowAddModal(true);
    };

    // ✅ Update product
    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        try {
            const updated: Product = await adminUpdateProduct(editingProduct._id, {
                title: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                stock: parseInt(newProduct.stock) || 0,
                images: newProduct.image ? [newProduct.image] : [],
                isTrending: false,
            });

            setProducts((prev) =>
                prev.map((p) => (p._id === updated._id ? updated : p))
            );

            toast.success('Product updated successfully');
            setEditingProduct(null);
            setShowAddModal(false);
        } catch {
            toast.error('Error updating product');
        }
    };

    // ✅ Dashboard stats
    const stats = {
        totalProducts: products.length,
        activeProducts: products.length, // No status in backend, so assuming all active
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    };

    return (
        <div className="pt-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div className="glass rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">Product Management</h2>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span>Add Product</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-4 px-2 text-white/80">Product</th>
                                            <th className="text-left py-4 px-2 text-white/80">Category</th>
                                            <th className="text-left py-4 px-2 text-white/80">Price</th>
                                            <th className="text-left py-4 px-2 text-white/80">Stock</th>
                                            <th className="text-left py-4 px-2 text-white/80">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id} className="border-b border-white/10">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center space-x-3">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.title}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-white/10 rounded-lg" />
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium">{product.title}</p>
                                                            <p className="text-white/60 text-sm">ID: {product._id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-white/80">{product.category}</td>
                                                <td className="py-4 px-2 text-white">${product.price}</td>
                                                <td className="py-4 px-2 text-white">{product.stock}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditProduct(product)}
                                                            className="p-2 glass rounded-lg hover:bg-white/20 transition-colors duration-200"
                                                        >
                                                            <PencilIcon className="w-4 h-4 text-white" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors duration-200"
                                                        >
                                                            <TrashIcon className="w-4 h-4 text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-2xl p-8 max-w-md w-full"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Price</label>
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Home">Home</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Books">Books</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Stock</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                            >
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingProduct(null);
                                }}
                                className="flex-1 py-3 glass text-white font-semibold rounded-xl hover:bg-white/20 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
