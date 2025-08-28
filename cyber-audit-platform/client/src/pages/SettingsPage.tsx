import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

interface ApiSettings {
  shodanApiKey: string;
  wpscanApiKey: string;
  dnsdumpsterApiKey: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ApiSettings>({
    shodanApiKey: '',
    wpscanApiKey: '',
    dnsdumpsterApiKey: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">API Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="shodanApiKey" className="block text-sm font-medium text-gray-700">
                  Shodan API Key
                </label>
                <input
                  type="text"
                  name="shodanApiKey"
                  id="shodanApiKey"
                  value={settings.shodanApiKey}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="wpscanApiKey" className="block text-sm font-medium text-gray-700">
                  WPSCAN API Key
                </label>
                <input
                  type="text"
                  name="wpscanApiKey"
                  id="wpscanApiKey"
                  value={settings.wpscanApiKey}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="dnsdumpsterApiKey" className="block text-sm font-medium text-gray-700">
                  DNSDumpster API Key
                </label>
                <input
                  type="text"
                  name="dnsdumpsterApiKey"
                  id="dnsdumpsterApiKey"
                  value={settings.dnsdumpsterApiKey}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
