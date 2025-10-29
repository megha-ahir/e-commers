// pages/api/razorpay/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ ok: false, error: 'Missing parameters' });
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const isValid = generated_signature === razorpay_signature;

        if (isValid) {
            // TODO: persist order / payment in DB
            return res.status(200).json({ ok: true });
        } else {
            return res.status(400).json({ ok: false, error: 'Invalid signature' });
        }
    } catch (err: any) {
        console.error('verify error', err);
        return res.status(500).json({ ok: false, error: err.message });
    }
}
