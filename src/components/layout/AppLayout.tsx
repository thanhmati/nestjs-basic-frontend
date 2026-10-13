import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import ToastContainer from '../common/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default AppLayout;
