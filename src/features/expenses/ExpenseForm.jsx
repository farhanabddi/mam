import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ExpenseForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      note: formData.note || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input 
        id="title"
        label="Expense Title" 
        required 
        placeholder="e.g. Electricity Bill"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      
      <Input 
        id="amount"
        label="Amount ($)" 
        type="number" 
        step="0.01" 
        min="0.01"
        required 
        value={formData.amount}
        onChange={(e) => setFormData({...formData, amount: e.target.value})}
      />

      <Input 
        id="note"
        label="Optional Note" 
        placeholder="Additional details..."
        value={formData.note}
        onChange={(e) => setFormData({...formData, note: e.target.value})}
      />

      <div className="flex justify-end gap-3 mt-4 border-t pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Record Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;