import React, { useState, useEffect } from 'react';
import { reportsService } from './reportsService';

export default function DailyVerificationPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportsService.getDailySummary(date);
      setReport(data);
    } catch (error) {
      console.error("Report Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [date]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg">
        <h1 className="text-2xl font-bold">Daily Drawer Verification</h1>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="border p-2 rounded"
        />
      </div>

      {loading && <p className="text-center">Loading Report...</p>}
      
      {report && !loading && (
        <div className="bg-white p-6 shadow rounded-lg space-y-6">
          <h2 className="text-xl font-bold border-b pb-2">Financial Breakdown for {report.date}</h2>
          
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div className="flex justify-between border-b py-2">
              <span className="text-gray-600">Total Cash Sales:</span>
              <span className="font-semibold text-green-600">${report.cash_sales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-gray-600">Total Credit Sales:</span>
              <span className="font-semibold text-orange-600">${report.credit_sales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-gray-600">Total Gross Sales:</span>
              <span className="font-bold">${report.total_sales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-2 text-red-600">
              <span>Less: Total Expenses:</span>
              <span>- ${report.total_expenses.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">Drawer Expectation</h3>
            <div className="flex justify-between text-xl">
              <span>Actual Cash in Register:</span>
              <span className="font-bold text-blue-900">${report.actual_cash_in_register.toFixed(2)}</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              (Cash Sales + Credit Payments Received) - Expenses
            </p>
          </div>
        </div>
      )}
    </div>
  );
}