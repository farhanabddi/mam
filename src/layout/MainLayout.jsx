import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left fixed Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* This Outlet is where the actual page components will be injected */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;