import React, { useState, useEffect } from 'react';
import { reportsService } from '../reports/reportsService';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const todayData = await reportsService.getDailySummary();
        const salesData = await reportsService.getRecentSales(5);
        setSummary(todayData);
        setRecentSales(salesData);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading Dashboard...</div>;
  if (!summary) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Today's Overview</h1>
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-semibold">Total Sales</p>
          <p className="text-2xl font-bold">${summary.total_sales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-semibold">Gross Profit</p>
          <p className="text-2xl font-bold">${summary.gross_profit.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-semibold">Expenses</p>
          <p className="text-2xl font-bold">${summary.total_expenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-semibold">Net Profit</p>
          <p className="text-2xl font-bold">${summary.net_profit.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 text-sm">
              <th className="p-3">Receipt</th>
              <th className="p-3">Type</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map(sale => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{sale.receipt_number}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${sale.sale_type === 'cash' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {sale.sale_type.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">{sale.customers?.name || 'Walk-in'}</td>
                <td className="p-3 font-semibold">${Number(sale.total_amount).toFixed(2)}</td>
              </tr>
            ))}
            {recentSales.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No sales yet today.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}