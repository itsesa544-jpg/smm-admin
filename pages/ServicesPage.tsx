
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';

const servicesData = [
  {
    category: 'Instagram',
    services: [
      { id: 101, name: 'Instagram Followers [Real]', rate: 5.00, min: 100, max: 10000, apiProvider: 'Provider A', apiServiceId: 'A-12' },
      { id: 102, name: 'Instagram Likes [HQ]', rate: 1.50, min: 50, max: 5000, apiProvider: 'Provider B', apiServiceId: 'B-05' },
    ]
  },
  {
    category: 'TikTok',
    services: [
      { id: 201, name: 'TikTok Views', rate: 0.10, min: 1000, max: 1000000, apiProvider: 'Provider A', apiServiceId: 'A-34' },
      { id: 202, name: 'TikTok Likes', rate: 2.00, min: 100, max: 10000, apiProvider: 'Provider C', apiServiceId: 'C-77' },
    ]
  },
  {
    category: 'YouTube',
    services: [
      { id: 301, name: 'YouTube Subscribers', rate: 25.00, min: 100, max: 1000, apiProvider: 'Provider B', apiServiceId: 'B-19' },
    ]
  }
];

const ServicesPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(servicesData[0]?.category || null);

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
      {servicesData.map(({ category, services }) => (
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
                  {services.map(service => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{service.id}</td>
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
