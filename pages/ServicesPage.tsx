import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface Service {
    id: string;
    name: string;
    rate: number;
    min: number;
    max: number;
    apiProvider: string;
    apiServiceId: string;
    category: string;
}

const ServicesPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const servicesCollectionRef = collection(db, 'services');
    // Order by category then by name for consistent grouping and listing
    const q = query(servicesCollectionRef, orderBy('category'), orderBy('name'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const servicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        
        // Group services by category
        const groupedServices = servicesList.reduce((acc, service) => {
            const category = service.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(service);
            return acc;
        }, {} as Record<string, Service[]>);

        const formattedData = Object.keys(groupedServices).map(category => ({
            category,
            services: groupedServices[category]
        }));

        setServicesData(formattedData);
        // Set the first category as open on initial load, but don't change it on subsequent updates
        if (loading && formattedData.length > 0) {
            setOpenCategory(formattedData[0].category);
        }
        setLoading(false);
    }, (error) => {
        console.error("Error fetching services in real-time: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
}, []);


  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Service Management</h2>
        <div className="flex gap-2">
            <button className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                <Plus size={18} className="mr-2" /> Add Category
            </button>
            <button className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                <Plus size={18} className="mr-2" /> Add Service
            </button>
        </div>
      </div>
      {loading ? <p>Loading services...</p> : servicesData.map(({ category, services }) => (
        <div key={category} className="bg-card rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex justify-between items-center p-4 bg-gray-50 border-b"
          >
            <h3 className="text-lg font-semibold text-text-primary">{category}</h3>
            {openCategory === category ? <ChevronUp /> : <ChevronDown />}
          </button>
          {openCategory === category && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Service Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Rate/1000</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Min/Max</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">API Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service: Service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{service.id.substring(0, 6)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${service.rate.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{service.min} / {service.max}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{service.apiProvider} (ID: {service.apiServiceId})</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="p-2 text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                        <button className="p-2 text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServicesPage;