'use client';

import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6 text-white">Analytics</h2>
            <div className="glass rounded-2xl p-6">
                <p className="text-white/80">📈 Coming soon: sales charts, user insights, etc.</p>
            </div>
        </motion.div>
    );
}
