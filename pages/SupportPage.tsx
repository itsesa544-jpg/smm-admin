import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

const statuses = ['All', 'Open', 'Answered', 'Closed'];

const SupportPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const ticketsQuery = query(collection(db, 'supportTickets'), orderBy('lastUpdate', 'desc'));

        const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
            const ticketsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTickets(ticketsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tickets in real-time: ", error);
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    const filteredTickets = tickets.filter(ticket =>
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
    
    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return timestamp.toDate().toLocaleString();
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
                {loading ? <p>Loading tickets...</p> : (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{ticket.id.substring(0,8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{ticket.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{ticket.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(ticket.lastUpdate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-primary hover:underline">View</button>
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

export default SupportPage;