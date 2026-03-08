import React, { useState, useEffect } from 'react';
import CartSection from './CartSection';
import ProductSearch from './ProductSearch'; // Assuming you have this
import { supabase } from '../../services/supabaseClient';

export default function SalesPage() {
  const [customers, setCustomers] = useState([]);

  // Fetch customers so the cashier can select them for credit sales
  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await supabase.from('customers').select('id, name').order('name');
      if (data) setCustomers(data);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4 bg-gray-100">
      {/* Left Side: Products */}
      <div className="w-2/3 bg-white shadow rounded-lg p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
        <ProductSearch />
      </div>

      {/* Right Side: Cart */}
      <div className="w-1/3 min-w-[300px]">
        <CartSection customers={customers} />
      </div>
    </div>
  );
}