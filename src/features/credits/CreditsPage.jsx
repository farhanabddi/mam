import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from './useCredits';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CreditsPage = () => {
  const { credits, isLoading, error, fetchCredits } = useCredits();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Accounts Receivable (Credits)</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">Patient/Customer</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Remaining</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && credits.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading database...</td></tr>
              ) : credits.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No credit records found.</td></tr>
              ) : (
                credits.map(credit => (
                  <tr key={credit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{credit.person_name}</td>
                    <td className="p-4 text-sm text-gray-600">{credit.phone || 'N/A'}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                        credit.status === 'open' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {credit.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-red-600 text-right">
                      ${parseFloat(credit.remaining_amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <Button variant="secondary" onClick={() => navigate(`/credits/${credit.id}`)}>
                        View & Pay
                      </Button>
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

export default CreditsPage;