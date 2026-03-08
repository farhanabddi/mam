import { supabase } from '../../services/supabaseClient';

export const creditService = {
  // 1. Get all credits (both open and closed)
  async getCredits() {
    const { data, error } = await supabase
      .from('credits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // 2. Get a single credit profile AND its payment history
  async getCreditDetails(creditId) {
    // Fetch the main credit record
    const { data: credit, error: creditError } = await supabase
      .from('credits')
      .select('*')
      .eq('id', creditId)
      .single();

    if (creditError) throw new Error(creditError.message);

    // Fetch the payment history
    const { data: payments, error: paymentsError } = await supabase
      .from('credit_payments')
      .select('*')
      .eq('credit_id', creditId)
      .order('payment_date', { ascending: false });

    if (paymentsError) throw new Error(paymentsError.message);

    return { credit, payments };
  },

  // 3. Process a payment
  async addPayment(creditId, paymentAmount, note, currentCredit) {
    const newPaidAmount = parseFloat(currentCredit.paid_amount) + parseFloat(paymentAmount);
    const newRemainingAmount = parseFloat(currentCredit.total_amount) - newPaidAmount;
    const newStatus = newRemainingAmount <= 0 ? 'closed' : 'open';

    // Step A: Insert the payment record
    const { error: insertError } = await supabase
      .from('credit_payments')
      .insert([{
        credit_id: creditId,
        amount: paymentAmount,
        note: note
      }]);

    if (insertError) throw new Error(insertError.message);

    // Step B: Update the main credit totals
    const { error: updateError } = await supabase
      .from('credits')
      .update({
        paid_amount: newPaidAmount,
        remaining_amount: newRemainingAmount,
        status: newStatus
      })
      .eq('id', creditId);

    if (updateError) throw new Error(updateError.message);

    return { success: true };
  }
};