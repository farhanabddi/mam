import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">MAM System</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-800">System Admin</span>
            <span className="text-xs text-gray-500">admin@clinic.com</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;