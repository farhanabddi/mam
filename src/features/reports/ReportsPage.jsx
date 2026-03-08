import React, { useState, useEffect } from 'react';
import { reportsService } from './reportsService';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllSales = async () => {
      try {
        setLoading(true);
        // This will now successfully call the function we just added
        const data = await reportsService.getTransactions();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSales();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading Report Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Sales Report</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 text-sm">
              <th className="p-4">Date</th>
              <th className="p-4">Receipt</th>
              <th className="p-4">Type</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Profit</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(sale => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-600">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
                <td className="p-4 font-mono text-sm">{sale.receipt_number}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    sale.sale_type === 'cash' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {sale.sale_type.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 capitalize">{sale.payment_method}</td>
                <td className="p-4">{sale.customers?.name || 'Walk-in'}</td>
                <td className="p-4 font-bold text-gray-800">${Number(sale.total_amount).toFixed(2)}</td>
                <td className="p-4 font-semibold text-green-600">${Number(sale.total_profit).toFixed(2)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No sales data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}