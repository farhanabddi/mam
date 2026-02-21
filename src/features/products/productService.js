import { supabase } from "../../services/supabaseClient";

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}