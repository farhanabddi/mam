// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import Layout from '../layout/MainLayout';

// Features
import DashboardPage from '../features/dashboard/DashboardPage'; // New Import
import ProductsPage from '../features/products/ProductsPage';
import ExpensesPage from '../features/expenses/ExpensesPage';
import CreditsPage from '../features/credits/CreditsPage';
import CreditDetailsPage from '../features/credits/CreditDetailsPage';
import SalesPage from '../features/sales/SalesPage';
import ReportsPage from '../features/reports/ReportsPage';
import DailyVerificationPage from '../features/reports/DailyVerificationPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Now they are separate! */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/reports" element={<ReportsPage />} />
          
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/credits/:id" element={<CreditDetailsPage />} />
          <Route path="reports/daily-verification" element={<DailyVerificationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;