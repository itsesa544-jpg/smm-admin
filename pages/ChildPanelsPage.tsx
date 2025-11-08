import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Plus, MoreVertical, Trash2, X, GitBranch, ShieldOff, ShieldCheck } from 'lucide-react';

const ChildPanelsPage: React.FC = () => {
    const [panels, setPanels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPanel, setNewPanel] = useState({ domain: '', ownerEmail: '' });
    const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'childPanels'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPanels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching child panels:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const generateApiKey = () => `panel_key_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const handleAddPanel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPanel.domain || !newPanel.ownerEmail) {
            alert("Please fill in all fields.");
            return;
        }
        const apiKey = generateApiKey();
        try {
            await addDoc(collection(db, 'childPanels'), {
                ...newPanel,
                apiKey,
                status: 'Active',
                createdAt: Timestamp.now(),
            });
            setGeneratedApiKey(apiKey);
            setNewPanel({ domain: '', ownerEmail: '' });
        } catch (error) {
            console.error("Error adding child panel:", error);
            alert("Failed to add child panel.");
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setGeneratedApiKey(null);
        setNewPanel({ domain: '', ownerEmail: '' });
    };

    const handleStatusChange = async (panelId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        try {
            const panelDoc = doc(db, 'childPanels', panelId);
            await updateDoc(panelDoc, { status: newStatus });
        } catch (error) {
            console.error("Error updating panel status:", error);
        }
        setActiveDropdown(null);
    };

    const handleDeletePanel = async (panelId: string) => {
        if (!confirm("Are you sure you want to delete this child panel? This action cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, 'childPanels', panelId));
        } catch (error) {
            console.error("Error deleting panel:", error);
        }
        setActiveDropdown(null);
    };

    const getStatusClass = (status: string) => {
        return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return timestamp.toDate().toLocaleDateString();
    };

    return (
        <>
            <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-text-primary">Child Panel Management</h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <Plus size={18} className="mr-2" /> Add New Panel
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {loading ? <p>Loading panels...</p> : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Domain</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Owner</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">API Key</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date Added</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {panels.map((panel) => (
                                    <tr key={panel.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{panel.domain}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{panel.ownerEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono">{panel.apiKey}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(panel.status)}`}>{panel.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(panel.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                            <button onClick={() => setActiveDropdown(activeDropdown === panel.id ? null : panel.id)} className="text-text-secondary hover:text-primary"><MoreVertical size={20} /></button>
                                            {activeDropdown === panel.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <a href="#" onClick={() => handleStatusChange(panel.id, panel.status)} className={`flex items-center px-4 py-2 text-sm ${panel.status === 'Active' ? 'text-yellow-700' : 'text-green-700'} hover:bg-gray-100`}>
                                                            {panel.status === 'Active' ? <ShieldOff size={16} className="mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
                                                            {panel.status === 'Active' ? 'Suspend' : 'Activate'}
                                                        </a>
                                                        <a href="#" onClick={() => handleDeletePanel(panel.id)} className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"><Trash2 size={16} className="mr-2" /> Delete</a>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                     { !loading && panels.length === 0 && (
                        <div className="text-center py-10">
                            <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No child panels</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new child panel.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Panel Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{generatedApiKey ? 'API Key Generated' : 'Add New Child Panel'}</h3>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                        </div>
                        {generatedApiKey ? (
                             <div>
                                <p className="text-sm text-text-secondary mb-2">Panel added successfully! Share this API Key with the panel owner. It will not be shown again.</p>
                                <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">{generatedApiKey}</div>
                                <button onClick={handleCloseModal} className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700">Done</button>
                             </div>
                        ) : (
                            <form onSubmit={handleAddPanel}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Panel Domain</label>
                                        <input type="text" id="domain" value={newPanel.domain} onChange={e => setNewPanel({...newPanel, domain: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                    </div>
                                    <div>
                                        <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Owner's Email</label>
                                        <input type="email" id="ownerEmail" value={newPanel.ownerEmail} onChange={e => setNewPanel({...newPanel, ownerEmail: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                    </div>
                                    <div className="pt-2">
                                        <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700">Generate API Key & Add</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChildPanelsPage;
