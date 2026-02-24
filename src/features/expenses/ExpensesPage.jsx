import React, { useState } from 'react';
import { useExpenses } from './useExpenses';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ExpenseForm from './ExpenseForm';

const ExpensesPage = () => {
  const { expenses, isLoading, error, addExpense } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpense = async (data) => {
    const result = await addExpense(data);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Clinic Expenses</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ New Expense</Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Record Expense</h2>
            <ExpenseForm 
              onSubmit={handleAddExpense} 
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={isLoading}
            />
          </Card>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Note</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && expenses.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading database...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No expenses recorded yet.</td></tr>
              ) : (
                expenses.map(exp => (
                  <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{exp.title}</td>
                    <td className="p-4 text-sm text-gray-500 truncate max-w-[200px]">
                      {exp.note || '-'}
                    </td>
                    <td className="p-4 text-sm font-bold text-red-600 text-right">
                      ${exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ExpensesPage;