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
