import React from 'react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Nmap Scanner', path: '/nmap' },
    { name: 'WPScan', path: '/wpscan' },
    { name: 'Brute Force', path: '/brute-force' },
    { name: 'Hardening Advisor', path: '/hardening' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center bg-gray-900">
        <h1 className="text-xl font-bold">CyberAudit</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;