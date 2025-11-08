import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { Users, ShoppingCart, DollarSign, List, Clock, UserPlus } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

const salesData = [
  { name: 'Day 1', orders: 20, revenue: 240 },
  { name: 'Day 2', orders: 35, revenue: 139 },
  { name: 'Day 3', orders: 45, revenue: 980 },
  { name: 'Day 4', orders: 27, revenue: 390 },
  { name: 'Day 5', orders: 55, revenue: 480 },
  { name: 'Day 6', orders: 23, revenue: 380 },
  { name: 'Day 7', orders: 60, revenue: 430 },
];

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, pending: 0 });
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const ordersCollection = collection(db, 'orders');

                const [usersSnapshot, ordersSnapshot] = await Promise.all([
                    getDocs(usersCollection),
                    getDocs(ordersCollection),
                ]);

                const totalUsers = usersSnapshot.size;
                const totalOrders = ordersSnapshot.size;
                const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().charge || 0), 0);
                
                const pendingOrdersQuery = query(ordersCollection, where('status', '==', 'Pending'));
                const pendingOrdersSnapshot = await getDocs(pendingOrdersQuery);
                const pendingOrdersCount = pendingOrdersSnapshot.size;

                setStats({
                    users: totalUsers,
                    orders: totalOrders,
                    revenue: totalRevenue,
                    pending: pendingOrdersCount,
                });

                // Fetch recent activities (last 2 new users and last 2 new orders)
                const recentUsersQuery = query(usersCollection, orderBy('createdAt', 'desc'), limit(2));
                const recentOrdersQuery = query(ordersCollection, orderBy('createdAt', 'desc'), limit(2));
                
                const [recentUsersSnap, recentOrdersSnap] = await Promise.all([
                    getDocs(recentUsersQuery),
                    getDocs(recentOrdersQuery)
                ]);

                const activities: any[] = [];
                recentUsersSnap.forEach(doc => {
                    const data = doc.data();
                    activities.push({
                        id: doc.id,
                        type: 'New User',
                        description: `${data.name} registered`,
                        time: data.createdAt?.toDate().toLocaleTimeString() || 'N/A',
                        icon: <UserPlus size={16}/>,
                        timestamp: data.createdAt?.toDate()
                    });
                });
                recentOrdersSnap.forEach(doc => {
                    const data = doc.data();
                    activities.push({
                        id: doc.id,
                        type: 'New Order',
                        description: `Order #${data.id} by ${data.user}`,
                        time: data.createdAt?.toDate().toLocaleTimeString() || 'N/A',
                        icon: <ShoppingCart size={16}/>,
                        timestamp: data.createdAt?.toDate()
                    });
                });
                
                activities.sort((a,b) => b.timestamp - a.timestamp);
                setRecentActivities(activities.slice(0, 4));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Users" value={loading ? '...' : stats.users.toLocaleString()} icon={<Users className="text-white" />} color="bg-blue-500" />
        <DashboardCard title="Total Orders" value={loading ? '...' : stats.orders.toLocaleString()} icon={<ShoppingCart className="text-white" />} color="bg-green-500" />
        <DashboardCard title="Total Revenue" value={loading ? '...' : `$${stats.revenue.toLocaleString()}`} icon={<DollarSign className="text-white" />} color="bg-indigo-500" />
        <DashboardCard title="Pending Orders" value={loading ? '...' : stats.pending.toLocaleString()} icon={<List className="text-white" />} color="bg-yellow-500" />
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Last 7 Days Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activities</h3>
          {loading ? <p>Loading activities...</p> : (
            <ul className="space-y-4">
                {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 bg-background rounded-full">{activity.icon}</div>
                    <div>
                    <p className="text-sm font-medium text-text-primary">{activity.type}</p>
                    <p className="text-xs text-text-secondary">{activity.description}</p>
                    <p className="text-xs text-text-secondary flex items-center mt-1">
                        <Clock size={12} className="mr-1"/>
                        {activity.time}
                    </p>
                    </div>
                </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
