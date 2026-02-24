import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from '../layout/MainLayout';

// Feature Pages
import DashboardPage from '../features/dashboard/DashboardPage';
import ProductsPage from '../features/products/ProductsPage';
import SalesPage from '../features/sales/SalesPage';
import CreditsPage from '../features/credits/CreditsPage';
import CreditDetailsPage from '../features/credits/CreditDetailsPage';
import ExpensesPage from '../features/expenses/ExpensesPage';
import ReportsPage from '../features/reports/ReportsPage';
import DailyVerificationPage from '../features/reports/DailyVerificationPage';

/**
 * AppRoutes defines the URL structure of the application.
 * It strictly handles navigation mapping, not UI rendering.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Later, we will wrap MainLayout in a <ProtectedRoute> component 
        to enforce the Supabase is_admin() requirement. 
      */}
      <Route element={<MainLayout />}>
        {/* Default route redirects to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        
        {/* Nested Credit Routes */}
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/credits/:id" element={<CreditDetailsPage />} />
        
        <Route path="/expenses" element={<ExpensesPage />} />
        
        {/* Nested Report Routes */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/daily-verification" element={<DailyVerificationPage />} />
      </Route>

      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={
        <div className="flex items-center justify-center h-screen text-gray-600">
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;