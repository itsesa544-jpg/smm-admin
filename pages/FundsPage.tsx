
import React from 'react';

const fundRequests = [
  { id: 1, user: 'john.doe@example.com', method: 'Bkash', amount: 50.00, transactionId: 'TRX12345', date: '2023-10-27 10:00' },
  { id: 2, user: 'jane.smith@example.com', method: 'Binance', amount: 100.00, transactionId: 'BIN98765', date: '2023-10-27 11:30' },
];

const paymentHistory = [
    { id: 1, user: 'emily.white@example.com', method: 'Nagad', amount: 20.00, status: 'Approved', date: '2023-10-26 09:00' },
    { id: 2, user: 'robert.brown@example.com', method: 'Bkash', amount: 10.00, status: 'Rejected', date: '2023-10-25 14:00' },
]

const FundsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Pending Fund Requests */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Pending Fund Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fundRequests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{req.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{req.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${req.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{req.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Management */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method Management</h2>
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary">Bkash Number</label>
                <input type="text" defaultValue="01234567890" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Nagad Number</label>
                <input type="text" defaultValue="01987654321" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Binance Pay ID</label>
                <input type="text" defaultValue="123456789" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div className="text-right">
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default FundsPage;
