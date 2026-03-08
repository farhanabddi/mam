import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCredits } from './useCredits';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreditDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCreditDetails, isLoading, error, fetchCreditDetails, processPayment } = useCredits();
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchCreditDetails(id);
  }, [id, fetchCreditDetails]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const result = await processPayment(id, parseFloat(paymentAmount), note);
    if (result.success) {
      setPaymentAmount('');
      setNote('');
    }
  };

  if (isLoading && !currentCreditDetails) return <div className="p-6">Loading details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!currentCreditDetails) return null;

  const { credit, payments } = currentCreditDetails;
  const isClosed = credit.status === 'closed';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/credits')}>&larr; Back</Button>
        <h1 className="text-2xl font-bold text-gray-800">Credit Profile: {credit.person_name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Summary & Payment Form */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white">
            <h3 className="text-slate-400 text-sm font-semibold mb-4">DEBT SUMMARY</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Original Total:</span>
                <span className="font-bold">${parseFloat(credit.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Total Paid:</span>
                <span className="font-bold">${parseFloat(credit.paid_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-400 text-xl border-t border-slate-700 pt-3 mt-3">
                <span>Remaining Debt:</span>
                <span className="font-bold">${parseFloat(credit.remaining_amount).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {!isClosed && (
            <Card className="p-6 border-l-4 border-emerald-500">
              <h3 className="font-bold text-gray-800 mb-4">Accept New Payment</h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <Input 
                  label="Payment Amount ($)" 
                  type="number" 
                  step="0.01" 
                  max={credit.remaining_amount} 
                  required 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                <Input 
                  label="Note (Optional)" 
                  placeholder="e.g. Paid via Zaad"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button type="submit" isLoading={isLoading} className="w-full">
                  Submit Payment
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Right Column: Payment History */}
        <Card className="p-0">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-800">Payment History</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {payments.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No payments made yet.</p>
            ) : (
              payments.map(pay => (
                <div key={pay.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(pay.payment_date).toLocaleDateString()}
                    </p>
                    {pay.note && <p className="text-xs text-gray-500">{pay.note}</p>}
                  </div>
                  <span className="font-bold text-emerald-600">+ ${parseFloat(pay.amount).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreditDetailsPage;