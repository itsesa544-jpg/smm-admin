import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { Users, ShoppingCart, DollarSign, List, Clock, UserPlus } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, pending: 0 });
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const recentUsersActivities = useRef<any[]>([]);
    const recentOrdersActivities = useRef<any[]>([]);

    useEffect(() => {
        const combineActivities = () => {
            const all = [...recentUsersActivities.current, ...recentOrdersActivities.current];
            all.sort((a, b) => {
                const timeA = a.timestamp?.getTime() || 0;
                const timeB = b.timestamp?.getTime() || 0;
                return timeB - timeA;
            });
            setRecentActivities(all.slice(0, 4));
        };

        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            setStats(prev => ({ ...prev, users: snapshot.size }));
            recentUsersActivities.current = snapshot.docs.slice(0, 2).map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: 'New User',
                    description: `${data.name} registered`,
                    time: data.createdAt?.toDate().toLocaleTimeString() || 'N/A',
                    icon: <UserPlus size={16}/>,
                    timestamp: data.createdAt?.toDate()
                };
            });
            combineActivities();
        }, (error) => console.error("Error with users listener:", error));

        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
            const allOrdersDocs = snapshot.docs;
            const allOrdersData = allOrdersDocs.map(doc => ({ id: doc.id, ...doc.data() }));

            const totalOrders = snapshot.size;
            const totalRevenue = allOrdersData.reduce((sum, order) => sum + (order.charge || 0), 0);
            const pendingOrdersCount = allOrdersData.filter(order => order.status === 'Pending').length;
            
            setStats(prev => ({ ...prev, orders: totalOrders, revenue: totalRevenue, pending: pendingOrdersCount, users: prev.users }));
            
            recentOrdersActivities.current = allOrdersDocs.slice(0, 2).map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: 'New Order',
                    description: `Order #${doc.id.substring(0,6)}... by ${data.user}`,
                    time: data.createdAt?.toDate().toLocaleTimeString() || 'N/A',
                    icon: <ShoppingCart size={16}/>,
                    timestamp: data.createdAt?.toDate()
                };
            });
            combineActivities();

            // Process data for chart (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const dataByDay: { [key: string]: { orders: number; revenue: number } } = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dayKey = d.toISOString().split('T')[0];
                dataByDay[dayKey] = { orders: 0, revenue: 0 };
            }

            allOrdersData.forEach(order => {
                if (order.createdAt) {
                    const orderDate = (order.createdAt as Timestamp).toDate();
                    if (orderDate >= sevenDaysAgo) {
                         const dayKey = orderDate.toISOString().split('T')[0];
                        if (dataByDay[dayKey]) {
                            dataByDay[dayKey].orders += 1;
                            dataByDay[dayKey].revenue += order.charge || 0;
                        }
                    }
                }
            });

            const formattedChartData = Object.keys(dataByDay).map(date => ({
                name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                orders: dataByDay[date].orders,
                revenue: parseFloat(dataByDay[date].revenue.toFixed(2)),
            }));

            setChartData(formattedChartData);
            setLoading(false);
        }, (error) => {
            console.error("Error with orders listener:", error);
            setLoading(false);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeOrders();
        };
    }, []);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Users" value={loading ? '...' : stats.users.toLocaleString()} icon={<Users className="text-white" />} color="bg-blue-500" />
        <DashboardCard title="Total Orders" value={loading ? '...' : stats.orders.toLocaleString()} icon={<ShoppingCart className="text-white" />} color="bg-green-500" />
        <DashboardCard title="Total Revenue" value={loading ? '...' : `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<DollarSign className="text-white" />} color="bg-indigo-500" />
        <DashboardCard title="Pending Orders" value={loading ? '...' : stats.pending.toLocaleString()} icon={<List className="text-white" />} color="bg-yellow-500" />
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Last 7 Days Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
