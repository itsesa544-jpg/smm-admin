
import React, { useState } from 'react';

const ticketsData = [
  { id: 1, subject: 'Order #1234 not starting', user: 'john.doe@example.com', status: 'Open', lastUpdate: '2h ago' },
  { id: 2, subject: 'Payment issue with Bkash', user: 'jane.smith@example.com', status: 'Open', lastUpdate: '1d ago' },
  { id: 3, subject: 'API question', user: 'api.user@example.com', status: 'Closed', lastUpdate: '3d ago' },
  { id: 4, subject: 'Refill request for order #1190', user: 'emily.white@example.com', status: 'Answered', lastUpdate: '5h ago' },
];

const statuses = ['All', 'Open', 'Answered', 'Closed'];

const SupportPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredTickets = ticketsData.filter(ticket =>
        statusFilter === 'All' || ticket.status === statusFilter
    );

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-800';
            case 'Answered': return 'bg-blue-100 text-blue-800';
            case 'Closed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Support Tickets</h2>
                <select
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Ticket ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Last Update</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{ticket.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{ticket.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{ticket.user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{ticket.lastUpdate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="text-primary hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportPage;
