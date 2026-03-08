import React, { useState } from 'react';
import { useCart } from './useCart';

export default function CartSection({ customers = [] }) {
  const { cartItems, cartTotal, isLoading, error, updateQuantity, removeFromCart, checkout } = useCart();
  
  // FIX: Default strictly to 'cash'
  const [saleType, setSaleType] = useState('cash'); 
  const [paymentMethod, setPaymentMethod] = useState('zaad');
  const [customerId, setCustomerId] = useState('');

  const handleCheckout = async () => {
    // Frontend Validation Check
    if (saleType === 'credit' && !customerId) {
      alert("Please select a customer for this credit sale.");
      return;
    }

    const result = await checkout({
      saleType,
      paymentMethod,
      customerId: saleType === 'credit' ? customerId : null
    });

    if (result.success) {
      alert(`Sale Complete! Receipt: ${result.receipt}`);
      // Reset form
      setSaleType('cash');
      setCustomerId('');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (cartItems.length === 0) return <div className="p-4 text-gray-500">Cart is empty</div>;

  return (
    <div className="flex flex-col h-full p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Current Order</h2>
      
      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto mb-4">
        {cartItems.map(item => (
          <div key={item.product_id} className="flex justify-between items-center mb-2 p-2 border-b">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.product_id, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product_id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
              <button onClick={() => removeFromCart(item.product_id)} className="ml-2 text-red-500">X</button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Controls */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>

        <select value={saleType} onChange={(e) => setSaleType(e.target.value)} className="w-full p-2 border rounded">
          <option value="cash">Cash Sale</option>
          <option value="credit">Credit Sale</option>
        </select>

        {saleType === 'credit' && (
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full p-2 border rounded border-red-300">
            <option value="">-- Select Customer --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}

        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
          <option value="zaad">Zaad</option>
          <option value="edahab">eDahab</option>
          <option value="cash">Physical Cash</option>
        </select>

        <button 
          onClick={handleCheckout} 
          disabled={isLoading || cartItems.length === 0}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Complete Sale'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}