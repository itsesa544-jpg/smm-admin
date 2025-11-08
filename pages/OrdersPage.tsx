import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

const statuses = ['All', 'Pending', 'Processing', 'In-progress', 'Completed', 'Partial', 'Canceled'];

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const ordersCollectionRef = collection(db, 'orders');
    // Query to order by creation time, newest first
    const q = query(ordersCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching orders in real-time: ", error);
        setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(order =>
    (statusFilter === 'All' || order.status === statusFilter) &&
    (order.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id?.toLowerCase().includes(searchTerm.toLowerCase()))
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
  
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleString();
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
              placeholder="Search by User, Service, ID..."
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
        {loading ? <p>Loading orders...</p> : (
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Charge</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary tooltip" title={order.id}>
                        {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary max-w-xs truncate" title={order.service}>{order.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${(order.charge || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                            {order.status}
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;