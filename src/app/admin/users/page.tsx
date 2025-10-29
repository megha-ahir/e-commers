'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminListCustomers, User as ApiUser } from '@/lib/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string; // required
    createdAt?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        adminListCustomers()
            .then((data: ApiUser[]) => {
                // Map API users to local User type
                const mappedUsers: User[] = data.map((u) => ({
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    role: (u as any).role ?? 'customer', // default role
                    createdAt: (u as any).createdAt,
                }));
                setUsers(mappedUsers);
            })
            .catch(() => setUsers([]));
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
            <h2 className="text-2xl font-bold mb-6 text-white">Users</h2>
            <div className="glass rounded-2xl p-6 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="py-3 text-left text-white/80">Name</th>
                            <th className="py-3 text-left text-white/80">Email</th>
                            <th className="py-3 text-left text-white/80">Joined</th>
                            <th className="py-3 text-left text-white/80">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-white/10">
                                <td className="py-3 text-white">{user.name}</td>
                                <td className="py-3 text-white/90">{user.email}</td>
                                <td className="py-3 text-white/70">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td className="py-3 text-white/80">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
