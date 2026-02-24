import { useState, useEffect, useCallback } from 'react';
import { expenseService } from './expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExpense = async (expenseData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newExpense = await expenseService.createExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, isLoading, error, addExpense, refreshExpenses: fetchExpenses };
};