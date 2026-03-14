import React, { useState, useEffect } from 'react';
import CartSection from './CartSection';
import ProductSearch from './ProductSearch'; 
import { supabase } from '../../services/supabaseClient';
import { useCart } from './useCart'; // 1. IMPORT HOOK HERE

export default function SalesPage() {
  const [customers, setCustomers] = useState([]);
  
  // 2. CREATE ONE MASTER CART HERE
  const cart = useCart(); 

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await supabase.from('customers').select('id, name').order('name');
      if (data) setCustomers(data);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4 bg-gray-100">
      <div className="w-2/3 bg-white shadow rounded-lg p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
        {/* 3. GIVE THE ADD FUNCTION TO THE LEFT SIDE */}
        <ProductSearch addToCart={cart.addToCart} />
      </div>

      <div className="w-1/3 min-w-[300px]">
        {/* 4. GIVE THE REST OF THE CART TO THE RIGHT SIDE */}
        <CartSection customers={customers} cart={cart} />
      </div>
    </div>
  );
}