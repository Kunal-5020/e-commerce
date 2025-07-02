// components/admin/UserManagement.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth, BASE_API_URL } from '../../lib/api';
import toast from 'react-hot-toast';

interface UserData {
    _id: string;
    firebaseUid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role: 'user' | 'admin';
    createdAt: string;
    lastLoginAt?: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Assuming an admin-only endpoint for fetching all users
            const data: UserData[] = await fetchWithAuth(`${BASE_API_URL}/admin/users`);
            setUsers(data);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to fetch users.');
            toast.error(`Failed to load users: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        if (!window.confirm(`Are you sure you want to change the role of this user to ${newRole}?`)) {
            return;
        }
        try {
            await fetchWithAuth(`${BASE_API_URL}/admin/users/${userId}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role: newRole }),
            });
            toast.success(`User role updated to ${newRole}.`);
            fetchUsers(); // Re-fetch users to update the list
        } catch (err: any) {
            console.error('Error updating user role:', err);
            toast.error(`Failed to update user role: ${err.message}`);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await fetchWithAuth(`${BASE_API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
            });
            toast.success('User deleted successfully.');
            fetchUsers(); // Re-fetch users to update the list
        } catch (err: any) {
            console.error('Error deleting user:', err);
            toast.error(`Failed to delete user: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center p-8">Loading users...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    if (users.length === 0) return <div className="text-center p-8 text-gray-600">No users found.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Users</h2>
                <button
                    onClick={fetchUsers}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Refresh Users
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 border-b border-gray-200">Email</th>
                            <th className="py-3 px-6 border-b border-gray-200">Name</th>
                            <th className="py-3 px-6 border-b border-gray-200">Role</th>
                            <th className="py-3 px-6 border-b border-gray-200">Created At</th>
                            <th className="py-3 px-6 border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left">{user.email}</td>
                                <td className="py-3 px-6 text-left">{user.firstName || 'N/A'} {user.lastName || ''}</td>
                                <td className="py-3 px-6 text-left">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                                        className="p-1 border border-gray-300 rounded-md bg-white"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="py-3 px-6 text-left">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-6 text-left">
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
