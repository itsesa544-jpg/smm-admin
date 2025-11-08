import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const handleFirebaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirebaseConfig(prevConfig => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleFirebaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving Firebase Config:', firebaseConfig);
    // Here you would typically save this config to a secure backend or context
    alert('Firebase configuration saved! (Check console for values)');
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* General Settings */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">General Settings</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-text-secondary">Site Name</label>
            <input type="text" id="siteName" defaultValue="My SMM Panel" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-text-secondary">Logo URL</label>
            <input type="text" id="logo" defaultValue="/logo.png" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-text-secondary">Default Currency</label>
            <select id="currency" defaultValue="USD" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option>USD</option>
              <option>EUR</option>
              <option>BDT</option>
            </select>
          </div>
          <div className="pt-2 text-right">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save General Settings</button>
          </div>
        </form>
      </div>

      {/* API Provider Settings */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">API Provider Settings</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="providerA" className="block text-sm font-medium text-text-secondary">Provider A API Key</label>
            <input type="password" id="providerA" defaultValue="**************" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="providerB" className="block text-sm font-medium text-text-secondary">Provider B API Key</label>
            <input type="password" id="providerB" defaultValue="**************" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div className="pt-2 text-right">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save API Keys</button>
          </div>
        </form>
      </div>

      {/* Firebase Integration */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">Firebase Integration</h2>
        <form className="space-y-4" onSubmit={handleFirebaseSubmit}>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary">API Key</label>
            <input 
              type="password" 
              id="apiKey"
              name="apiKey" 
              placeholder="Enter your Firebase API Key" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              value={firebaseConfig.apiKey}
              onChange={handleFirebaseChange}
            />
          </div>
          <div>
            <label htmlFor="authDomain" className="block text-sm font-medium text-text-secondary">Auth Domain</label>
            <input 
              type="text" 
              id="authDomain" 
              name="authDomain"
              placeholder="your-project-id.firebaseapp.com" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              value={firebaseConfig.authDomain}
              onChange={handleFirebaseChange}
            />
          </div>
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-text-secondary">Project ID</label>
            <input 
              type="text" 
              id="projectId"
              name="projectId"
              placeholder="your-project-id" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              value={firebaseConfig.projectId}
              onChange={handleFirebaseChange}
            />
          </div>
          <div>
            <label htmlFor="storageBucket" className="block text-sm font-medium text-text-secondary">Storage Bucket</label>
            <input 
              type="text" 
              id="storageBucket"
              name="storageBucket" 
              placeholder="your-project-id.appspot.com" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              value={firebaseConfig.storageBucket}
              onChange={handleFirebaseChange}
            />
          </div>
          <div>
            <label htmlFor="messagingSenderId" className="block text-sm font-medium text-text-secondary">Messaging Sender ID</label>
            <input 
              type="text" 
              id="messagingSenderId" 
              name="messagingSenderId"
              placeholder="1234567890" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
              value={firebaseConfig.messagingSenderId}
              onChange={handleFirebaseChange}
            />
          </div>
          <div>
            <label htmlFor="appId" className="block text-sm font-medium text-text-secondary">App ID</label>
            <input 
              type="text" 
              id="appId"
              name="appId"
              placeholder="1:1234567890:web:abcdef123456" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={firebaseConfig.appId}
              onChange={handleFirebaseChange}
            />
          </div>
          <div className="pt-2 text-right">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save Firebase Config</button>
          </div>
        </form>
      </div>

       {/* Announcements */}
       <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">Announcements / Notices</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="announcement" className="block text-sm font-medium text-text-secondary">Post a notice to all users</label>
            <textarea id="announcement" rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="Enter your announcement here..."></textarea>
          </div>
          <div className="pt-2 text-right">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Post Announcement</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SettingsPage;