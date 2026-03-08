import { useState, useCallback } from 'react';
import { creditService } from './creditService';

export const useCredits = () => {
  const [credits, setCredits] = useState([]);
  const [currentCreditDetails, setCurrentCreditDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCredits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await creditService.getCredits();
      setCredits(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch credits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCreditDetails = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await creditService.getCreditDetails(id);
      setCurrentCreditDetails(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch credit details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processPayment = async (creditId, amount, note) => {
    setIsLoading(true);
    setError(null);
    try {
      await creditService.addPayment(creditId, amount, note, currentCreditDetails.credit);
      // Refresh the details immediately after successful payment
      await fetchCreditDetails(creditId);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to process payment');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    credits, 
    currentCreditDetails, 
    isLoading, 
    error, 
    fetchCredits, 
    fetchCreditDetails, 
    processPayment 
  };
};