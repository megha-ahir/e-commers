'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  getCart,
  updateCart,
  clearCart as clearCartAPI,
  checkout
} from '@/lib/api';

interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
  };
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('66f7b9d41e5c8f42d6b81a20'); // TODO: Replace with actual user ID from auth

  // ✅ Fetch cart data on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCart(userId);
        setCartItems(data.items as CartItem[]);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  // ✅ Update quantity in cart
  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeItem(productId);
        return;
      }

      const updatedItems = cartItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedItems);
      await updateCart(userId, updatedItems.map(i => ({
        product: i.product._id,
        quantity: i.quantity
      })));
      toast.success('Quantity updated');
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  // ✅ Remove single item
  const removeItem = async (productId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.product._id !== productId);
      setCartItems(updatedItems);
      await updateCart(userId, updatedItems.map(i => ({
        product: i.product._id,
        quantity: i.quantity
      })));
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    try {
      await clearCartAPI(userId);
      setCartItems([]);
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  // ✅ Checkout handler (Fixed)
  const handleCheckout = async () => {
    try {
      // 🧮 Ensure total is valid
      if (total <= 0) {
        toast.error('Cart total must be greater than 0');
        return;
      }

      // 1️⃣ Create order on your server
      const resp = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      if (!resp.ok) throw new Error('Failed to create order');
      const order = await resp.json();

      // 2️⃣ Load Razorpay SDK before using it
      await loadRazorpayScript();

      // ✅ Ensure Razorpay key is available
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) {
        console.error('❌ Razorpay key is missing in environment variables');
        toast.error('Payment setup error — contact support');
        return;
      }

      // 3️⃣ Configure Razorpay checkout options
      const options = {
        key, // ✅ Required
        amount: order.amount, // in paise (should come from backend)
        currency: order.currency || 'INR',
        name: 'Your Shop Name',
        description: 'Order Checkout',
        order_id: order.id, // ✅ Razorpay order ID from backend
        handler: async function (response: any) {
          // 4️⃣ Verify payment signature on backend
          const verifyResp = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyResp.json();
          if (verifyData.ok) {
            toast.success('✅ Payment successful!');
            setCartItems([]);
          } else {
            toast.error('❌ Payment verification failed');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: { color: '#F37254' },
      };

      // 5️⃣ Open Razorpay Checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Checkout failed');
    }
  };

  function loadRazorpayScript() {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Razorpay) return resolve(); // ✅ Correct global check
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });
  }


  // 🧮 Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading your cart...
      </div>
    );
  }

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
            Your <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-xl text-white/80">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
              <ShoppingBagIcon className="w-24 h-24 text-white/40 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Your cart is empty</h3>
              <p className="text-white/80 mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Start Shopping
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.product.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-2">
                        {item.product.category}
                      </p>
                      <p className="text-xl font-bold gradient-text">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        className="p-2 glass rounded-lg hover:bg-white/20 transition-colors duration-200"
                      >
                        <MinusIcon className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-white font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        className="p-2 glass rounded-lg hover:bg-white/20 transition-colors duration-200"
                      >
                        <PlusIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors duration-200"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCart}
                className="w-full py-3 glass text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-colors duration-200"
              >
                Clear Cart
              </motion.button>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/80">Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Tax</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="gradient-text">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-2 mb-4"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 glass text-white font-medium rounded-xl hover:bg-white/20 transition-colors duration-200"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
