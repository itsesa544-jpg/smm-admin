import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, increment, deleteDoc, writeBatch } from 'firebase/firestore';

const FundsPage: React.FC = () => {
    const [fundRequests, setFundRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState({
        bkash: '',
        nagad: '',
        binance: '',
    });

    useEffect(() => {
        const fetchFundRequests = async () => {
            setLoadingRequests(true);
            try {
                const requestsCollection = collection(db, 'fundRequests');
                const requestsSnapshot = await getDocs(requestsCollection);
                setFundRequests(requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching fund requests: ", error);
            } finally {
                setLoadingRequests(false);
            }
        };

        const fetchPaymentMethods = async () => {
            try {
                const docRef = doc(db, 'settings', 'paymentMethods');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPaymentMethods(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching payment methods: ", error);
            }
        };

        fetchFundRequests();
        fetchPaymentMethods();
    }, []);

    const handleRequest = async (request: any, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        const batch = writeBatch(db);
        const requestDocRef = doc(db, 'fundRequests', request.id);

        if (action === 'approve') {
            // Find user by email to update balance. In a real app, you'd use user ID.
            const userDocRef = doc(db, 'users', request.userId); 
            batch.update(userDocRef, {
                balance: increment(request.amount)
            });
        }
        
        // In both cases, delete the request
        batch.delete(requestDocRef);

        try {
            await batch.commit();
            setFundRequests(fundRequests.filter(req => req.id !== request.id));
            alert(`Request ${action}d successfully.`);
        } catch (error) {
            console.error(`Error processing request: `, error);
            alert(`Failed to ${action} request.`);
        }
    };
    
    const handleMethodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentMethods(prev => ({...prev, [name]: value }));
    }

    const handleMethodsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const docRef = doc(db, 'settings', 'paymentMethods');
            await setDoc(docRef, paymentMethods, { merge: true });
            alert('Payment methods saved!');
        } catch (error) {
            console.error("Error saving payment methods: ", error);
            alert('Failed to save payment methods.');
        }
    }

  return (
    <div className="space-y-8">
      {/* Pending Fund Requests */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Pending Fund Requests</h2>
        <div className="overflow-x-auto">
          {loadingRequests ? <p>Loading requests...</p> : (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{req.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{req.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${(req.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{req.transactionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => handleRequest(req, 'approve')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                        <button onClick={() => handleRequest(req, 'reject')} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Method Management */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method Management</h2>
        <form className="space-y-4" onSubmit={handleMethodsSubmit}>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Bkash Number</label>
                <input type="text" name="bkash" value={paymentMethods.bkash} onChange={handleMethodsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Nagad Number</label>
                <input type="text" name="nagad" value={paymentMethods.nagad} onChange={handleMethodsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary">Binance Pay ID</label>
                <input type="text" name="binance" value={paymentMethods.binance} onChange={handleMethodsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"/>
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
