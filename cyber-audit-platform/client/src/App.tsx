import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import './index.css';

// Define types for our data
interface VulnerabilitySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface RecentScan {
  id: number;
  target: string;
  type: string;
  date: string;
  status: string;
}

const API_URL = 'http://localhost:5000/api';

function App() {
  const [summary, setSummary] = useState<VulnerabilitySummary | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

  useEffect(() => {
    // Fetch vulnerability summary
    fetch(`${API_URL}/vulnerabilities/summary`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);

    // Fetch recent scans
    fetch(`${API_URL}/scans/recent`)
      .then((res) => res.json())
      .then(setRecentScans)
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Critical</h3>
              <p className="text-4xl font-bold text-red-600">{summary?.critical ?? '-'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">High</h3>
              <p className="text-4xl font-bold text-orange-500">{summary?.high ?? '-'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Medium</h3>
              <p className="text-4xl font-bold text-yellow-500">{summary?.medium ?? '-'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Low</h3>
              <p className="text-4xl font-bold text-green-500">{summary?.low ?? '-'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Scan Activity</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2">Target</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3">{scan.target}</td>
                    <td className="py-3">{scan.type}</td>
                    <td className="py-3">{new Date(scan.date).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${scan.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
