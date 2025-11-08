
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ordersData = [
  { id: 1, user: 'John Doe', service: 'Instagram Followers', link: 'instagram.com/user', quantity: 1000, charge: 5.00, status: 'Completed' },
  { id: 2, user: 'Jane Smith', service: 'TikTok Likes', link: 'tiktok.com/video/123', quantity: 500, charge: 2.50, status: 'Processing' },
  { id: 3, user: 'Robert Brown', service: 'YouTube Views', link: 'youtube.com/watch?v=abc', quantity: 10000, charge: 50.00, status: 'Pending' },
  { id: 4, user: 'Emily White', service: 'Facebook Page Likes', link: 'facebook.com/page', quantity: 2000, charge: 20.00, status: 'In-progress' },
  { id: 5, user: 'Michael Green', service: 'Instagram Followers', link: 'instagram.com/user2', quantity: 500, charge: 2.50, status: 'Partial' },
  { id: 6, user: 'John Doe', service: 'Twitter Retweets', link: 'twitter.com/tweet/456', quantity: 100, charge: 1.00, status: 'Canceled' },
];

const statuses = ['All', 'Pending', 'Processing', 'In-progress', 'Completed', 'Partial', 'Canceled'];

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = ordersData.filter(order =>
    (statusFilter === 'All' || order.status === statusFilter) &&
    (order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.link.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In-progress': return 'bg-indigo-100 text-indigo-800';
      case 'Partial': return 'bg-purple-100 text-purple-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-text-primary">Order Management</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Link</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Charge</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary truncate max-w-xs">{order.link}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${order.charge.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
