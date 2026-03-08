import { supabase } from "../../services/supabaseClient";

export const reportsService = {
  getDailySummary: async (dateString) => {
    try {
      const targetDate = dateString || new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.rpc("get_daily_summary", { target_date: targetDate });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching daily summary:", err.message);
      throw err;
    }
  },

  getRecentSales: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('sales') 
        .select(`id, receipt_number, sale_type, payment_method, total_amount, created_at, customers ( name )`)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching recent sales:", err.message);
      throw err;
    }
  },

  // ADD THIS NEW FUNCTION: This fixes the "is not a function" error
  getTransactions: async () => {
    try {
      // We pull from the new 'sales' table instead of the old 'transactions' table
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id,
          receipt_number,
          sale_type,
          payment_method,
          total_amount,
          total_profit,
          created_at,
          customers ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching all transactions:", err.message);
      throw err;
    }
  }
};