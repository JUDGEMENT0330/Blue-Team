import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div>
        <span className="text-gray-600">User Profile</span>
      </div>
    </header>
  );
};

export default Header;