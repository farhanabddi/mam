import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/sales', label: 'Sales (POS)' },
    { path: '/products', label: 'Products' },
    { path: '/credits', label: 'Credits' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/reports', label: 'Reports' },
    { path: '/reports/daily-verification', label: 'Daily Verification' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-lg z-20">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-wider text-emerald-400">MAM</h1>
        <p className="text-xs text-slate-400 mt-1">Pharmacy & Store Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white border-l-4 border-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Secure Production Mode
      </div>
    </aside>
  );
};

export default Sidebar;