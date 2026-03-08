import { supabase } from '../../services/supabaseClient';

export const dailyVerificationService = {
  async getDailyStats(targetDate) {
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    // 1. Fetch Today's Transactions
    const { data: txns, error: txnError } = await supabase
      .from('transactions')
      .select('total_amount, sale_type')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);
    if (txnError) throw new Error(txnError.message);

    // 2. Fetch Today's Expenses
    const { data: exps, error: expError } = await supabase
      .from('expenses')
      .select('amount')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);
    if (expError) throw new Error(expError.message);

    // 3. Fetch Today's Credit Payments Received
    const { data: credits, error: creditError } = await supabase
      .from('credit_payments')
      .select('amount')
      .gte('payment_date', startOfDay)
      .lte('payment_date', endOfDay);
    if (creditError) throw new Error(creditError.message);

    // Calculate Totals strictly in the Service Layer
    const cashSales = txns.filter(t => t.sale_type === 'cash').reduce((sum, t) => sum + parseFloat(t.total_amount), 0);
    const creditSales = txns.filter(t => t.sale_type === 'credit').reduce((sum, t) => sum + parseFloat(t.total_amount), 0);
    const totalExpenses = exps.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const creditPaymentsReceived = credits.reduce((sum, c) => sum + parseFloat(c.amount), 0);

    // Expected Cash = Cash Sales + Credit Payments Received - Expenses
    const expectedCash = (cashSales + creditPaymentsReceived) - totalExpenses;

    return {
      cashSales,
      creditSales,
      totalExpenses,
      creditPaymentsReceived,
      expectedCash
    };
  },

  async saveVerification(verificationData) {
    // We assume you have a daily_verifications table for audit logging.
    // If not, this serves as a foundation for when you add it to Supabase.
    const { data, error } = await supabase
      .from('daily_payment_verifications')
      .insert([verificationData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};