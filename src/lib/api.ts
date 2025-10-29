import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isTrending: boolean;
}

export interface CartItem { product: string; quantity: number }
export interface Cart { user: string; items: Array<{ product: Product | string; quantity: number }>; }
export interface OrderItem { product: string; quantity: number; priceAtPurchase: number }
export interface Order { _id: string; user: string; items: OrderItem[]; total: number; status: string }
export interface User { _id: string; name: string; email: string; isAdmin: boolean, createdAt?: string; }

// Home
export async function getTrendingProducts() {
    const res = await http.get<Product[]>('/api/home/trending');
    return res.data;
}

// Products
export async function listProducts() {
    const res = await http.get<Product[]>('/api/products');
    return res.data;
}
export async function getProductsByCategory(category: string) {
    const res = await http.get<Product[]>(`/api/products/category/${encodeURIComponent(category)}`);
    return res.data;
}
export async function getProductDetails(id: string) {
    const res = await http.get<Product>(`/api/products/${id}`);
    return res.data;
}
export async function addToCart(productId: string, userId: string, quantity = 1) {
    const res = await http.post<Cart>(`/api/products/${productId}/add-to-cart`, { userId, quantity });
    return res.data;
}

// Cart
export async function getCart(userId: string) {
    const res = await http.get<Cart>(`/api/cart/${userId}`);
    return res.data;
}
export async function updateCart(userId: string, items: CartItem[]) {
    const res = await http.patch<Cart>(`/api/cart/${userId}`, { items });
    return res.data;
}
export async function checkout(userId: string) {
    const res = await http.post<Order>(`/api/cart/${userId}/checkout`);
    return res.data;
}
export async function clearCart(userId: string) {
    await http.delete(`/api/cart/${userId}`);
}

// User
export async function getUserDetails(userId: string) {
    const res = await http.get<User>(`/api/user/${userId}`);
    return res.data;
}
export async function getOrderHistory(userId: string) {
    const res = await http.get<Order[]>(`/api/user/${userId}/orders`);
    return res.data;
}
export async function getOrderDetails(userId: string, orderId: string) {
    const res = await http.get<Order>(`/api/user/${userId}/orders/${orderId}`);
    return res.data;
}

// Admin - Products
export async function adminListProducts() { return (await http.get<Product[]>('/api/admin/products')).data }
export async function adminCreateProduct(payload: Partial<Product>) { return (await http.post<Product>('/api/admin/products', payload)).data }
export async function adminUpdateProduct(id: string, payload: Partial<Product>) { return (await http.patch<Product>(`/api/admin/products/${id}`, payload)).data }
export async function adminDeleteProduct(id: string) { return (await http.delete(`/api/admin/products/${id}`)).data }

// Admin - Customers
export async function adminListCustomers() { return (await http.get<User[]>('/api/admin/customers')).data }
export async function adminCreateCustomer(payload: Partial<User>) { return (await http.post<User>('/api/admin/customers', payload)).data }
export async function adminUpdateCustomer(id: string, payload: Partial<User>) { return (await http.patch<User>(`/api/admin/customers/${id}`, payload)).data }
export async function adminDeleteCustomer(id: string) { return (await http.delete(`/api/admin/customers/${id}`)).data }


// pages/api/razorpay/create-order.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { amount, currency = 'INR', receipt = 'rcptid_11' } = req.body;

        if (!amount) return res.status(400).json({ error: 'Missing amount' });

        // Razorpay expects amount in paise (INR * 100)
        const options = {
            amount: Math.round(amount * 100), // e.g., 499.99 -> 49999
            currency,
            receipt,
            payment_capture: 1, // auto-capture
        };

        const order = await razorpay.orders.create(options);
        return res.status(200).json(order);
    } catch (err: any) {
        console.error('create-order error', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
}
