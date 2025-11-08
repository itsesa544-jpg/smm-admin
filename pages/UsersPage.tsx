
import React, { useState } from 'react';
import { Search, MoreVertical, Edit, Trash2, DollarSign, Ban } from 'lucide-react';

const usersData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', balance: 150.75, status: 'Active', orders: 12 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', balance: 25.00, status: 'Active', orders: 5 },
  { id: 3, name: 'Robert Brown', email: 'robert.brown@example.com', balance: 0, status: 'Inactive', orders: 0 },
  { id: 4, name: 'Emily White', email: 'emily.white@example.com', balance: 500.20, status: 'Active', orders: 35 },
  { id: 5, name: 'Michael Green', email: 'michael.green@example.com', balance: 10.50, status: 'Banned', orders: 2 },
];

const UsersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-yellow-100 text-yellow-800';
            case 'Banned': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Balance</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Total Orders</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/150?u=${user.email}`} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-text-primary">{user.name}</div>
                                            <div className="text-sm text-text-secondary">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">${user.balance.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.orders}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                    <button onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)} className="text-text-secondary hover:text-primary">
                                        <MoreVertical size={20} />
                                    </button>
                                    {activeDropdown === user.id && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><Edit size={16} className="mr-2" /> View/Edit Profile</a>
                                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><DollarSign size={16} className="mr-2" /> Add/Subtract Balance</a>
                                                <a href="#" className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100" role="menuitem"><Ban size={16} className="mr-2" /> Ban User</a>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;
