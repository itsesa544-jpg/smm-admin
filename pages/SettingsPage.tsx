import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';

const SettingsPage: React.FC = () => {
    // State for each settings card
    const [generalSettings, setGeneralSettings] = useState({ siteName: '', logoUrl: '', currency: 'USD' });
    const [apiSettings, setApiSettings] = useState({ providerA: '', providerB: '' });
    const [firebaseConfig, setFirebaseConfig] = useState({ apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '' });
    const [announcement, setAnnouncement] = useState('');

    // Fetch all settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const generalRef = doc(db, "settings", "general");
                const apiRef = doc(db, "settings", "apiProviders");
                const firebaseRef = doc(db, "settings", "firebaseConfig");

                const [generalSnap, apiSnap, firebaseSnap] = await Promise.all([
                    getDoc(generalRef),
                    getDoc(apiRef),
                    getDoc(firebaseRef)
                ]);

                if (generalSnap.exists()) setGeneralSettings(generalSnap.data());
                if (apiSnap.exists()) setApiSettings(apiSnap.data());
                if (firebaseSnap.exists()) setFirebaseConfig(firebaseSnap.data());
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);
    
    // Generic handler to save a settings document
    const handleSave = async (collection: string, docName: string, data: any, successMessage: string) => {
        try {
            await setDoc(doc(db, collection, docName), data);
            alert(successMessage);
        } catch (error) {
            console.error(`Error saving ${docName}:`, error);
            alert(`Error saving ${docName}.`);
        }
    };

    // Specific submit handlers
    const handleGeneralSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave('settings', 'general', generalSettings, 'General settings saved!');
    };
    const handleApiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave('settings', 'apiProviders', apiSettings, 'API keys saved!');
    };
    const handleFirebaseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave('settings', 'firebaseConfig', firebaseConfig, 'Firebase config saved!');
    };
    const handleAnnouncementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcement.trim()) return alert("Announcement cannot be empty.");
        try {
            await addDoc(collection(db, "announcements"), {
                text: announcement,
                createdAt: new Date(),
            });
            alert('Announcement posted!');
            setAnnouncement('');
        } catch (error) {
            console.error("Error posting announcement:", error);
            alert('Failed to post announcement.');
        }
    };
    
    // Generic input change handlers
    const createChangeHandler = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGeneralChange = createChangeHandler(setGeneralSettings);
    const handleApiChange = createChangeHandler(setApiSettings);
    const handleFirebaseChange = createChangeHandler(setFirebaseConfig);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* General Settings */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">General Settings</h2>
        <form className="space-y-4" onSubmit={handleGeneralSubmit}>
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-text-secondary">Site Name</label>
            <input type="text" id="siteName" name="siteName" value={generalSettings.siteName} onChange={handleGeneralChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-text-secondary">Logo URL</label>
            <input type="text" id="logoUrl" name="logoUrl" value={generalSettings.logoUrl} onChange={handleGeneralChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-text-secondary">Default Currency</label>
            <select id="currency" name="currency" value={generalSettings.currency} onChange={handleGeneralChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
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
        <form className="space-y-4" onSubmit={handleApiSubmit}>
          <div>
            <label htmlFor="providerA" className="block text-sm font-medium text-text-secondary">Provider A API Key</label>
            <input type="password" id="providerA" name="providerA" value={apiSettings.providerA} onChange={handleApiChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="providerB" className="block text-sm font-medium text-text-secondary">Provider B API Key</label>
            <input type="password" id="providerB" name="providerB" value={apiSettings.providerB} onChange={handleApiChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div className="pt-2 text-right">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save API Keys</button>
          </div>
        </form>
      </div>

      {/* Firebase Integration */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">Firebase Integration (For Client App)</h2>
        <form className="space-y-4" onSubmit={handleFirebaseSubmit}>
          {Object.keys(firebaseConfig).map(key => (
             <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-text-secondary">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input 
                  type={key.toLowerCase().includes('key') ? 'password' : 'text'}
                  id={key}
                  name={key}
                  placeholder={`Enter your ${key}`}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={firebaseConfig[key as keyof typeof firebaseConfig]}
                  onChange={handleFirebaseChange}
                />
              </div>
          ))}
          <div className="pt-2 text-right">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save Firebase Config</button>
          </div>
        </form>
      </div>

       {/* Announcements */}
       <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-text-primary border-b pb-4 mb-4">Announcements / Notices</h2>
        <form className="space-y-4" onSubmit={handleAnnouncementSubmit}>
          <div>
            <label htmlFor="announcement" className="block text-sm font-medium text-text-secondary">Post a notice to all users</label>
            <textarea id="announcement" rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="Enter your announcement here..." value={announcement} onChange={(e) => setAnnouncement(e.target.value)}></textarea>
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
