import React from 'react';
import { useStore } from '../../store';
import { Navigate } from 'react-router-dom';
import ExporterDashboard from './ExporterDashboard';
import AdminDashboard from './AdminDashboard';
import SupplierDashboard from './SupplierDashboard';

export default function DashboardRouter() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser.role) {
    case 'Exporter':
      return <ExporterDashboard />;
    case 'Supplier':
      return <SupplierDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="p-8 bg-white rounded-sm shadow-sm shadow-black/5 border-l-4 border-slate-300">
          <h1 className="text-2xl font-bold text-navy mb-4 uppercase tracking-wide">{currentUser.role} Dashboard</h1>
          <p className="text-slate-600 text-sm">Welcome, {currentUser.name}!</p>
        </div>
      );
  }
}
