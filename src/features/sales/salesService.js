import { supabase } from "../../services/supabaseClient";

export const salesService = {
  processTransaction: async (payload) => {
    try {
      // Basic safety check before wasting a network request
      if (!payload || !payload.items || payload.items.length === 0) {
        throw new Error("Cannot process an empty cart.");
      }

      // Call the NEW backend function: 'process_sale'
      const { data, error } = await supabase.rpc(
        "process_sale", 
        { payload }
      );

      if (error) {
        // This will catch any RAISE EXCEPTION messages from your SQL (like "Insufficient stock")
        console.error("Database rejected transaction:", error.message);
        throw new Error(error.message);
      }

      // Data contains the JSON object returned from the SQL function
      // e.g., { success: true, sale_id: "...", receipt: "RCPT-...", total: 15.00 }
      return data;

    } catch (err) {
      console.error("Service Layer Error:", err.message);
      throw err;
    }
  }
};