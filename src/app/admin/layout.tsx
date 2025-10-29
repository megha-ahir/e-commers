'use client';

import Navbar from "@/components/Navbar";
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
