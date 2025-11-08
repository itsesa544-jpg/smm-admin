
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { Users, ShoppingCart, DollarSign, List, Clock, UserPlus } from 'lucide-react';

const salesData = [
  { name: 'Day 1', orders: 20, revenue: 240 },
  { name: 'Day 2', orders: 35, revenue: 139 },
  { name: 'Day 3', orders: 45, revenue: 980 },
  { name: 'Day 4', orders: 27, revenue: 390 },
  { name: 'Day 5', orders: 55, revenue: 480 },
  { name: 'Day 6', orders: 23, revenue: 380 },
  { name: 'Day 7', orders: 60, revenue: 430 },
];

const recentActivities = [
    { id: 1, type: 'New Order', description: 'Order #1234 by user@example.com', time: '2m ago', icon: <ShoppingCart size={16}/> },
    { id: 2, type: 'New User', description: 'john.doe registered', time: '15m ago', icon: <UserPlus size={16}/> },
    { id: 3, type: 'Fund Added', description: '$50 added by jane.doe', time: '1h ago', icon: <DollarSign size={16}/> },
    { id: 4, type: 'Order Completed', description: 'Order #1230 for user2@example.com', time: '3h ago', icon: <ShoppingCart size={16}/> },
];


const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Users" value="1,250" icon={<Users className="text-white" />} color="bg-blue-500" />
        <DashboardCard title="Total Orders" value="5,430" icon={<ShoppingCart className="text-white" />} color="bg-green-500" />
        <DashboardCard title="Total Revenue" value="$25,600" icon={<DollarSign className="text-white" />} color="bg-indigo-500" />
        <DashboardCard title="Pending Orders" value="75" icon={<List className="text-white" />} color="bg-yellow-500" />
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
