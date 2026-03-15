import React, { useState } from 'react';

export default function CartSection({ cart }) {
  const { cartItems, cartTotal, isLoading, error, updateQuantity, removeFromCart, checkout } = cart;
  
  const [saleType, setSaleType] = useState('cash'); 
  const [paymentMethod, setPaymentMethod] = useState('zaad');
  
  // NEW: State for the text boxes you requested
  const [creditName, setCreditName] = useState('');
  const [creditPhone, setCreditPhone] = useState('');

  const handleCheckout = async () => {
    // Block the sale if they choose credit but leave the name blank
    if (saleType === 'credit' && creditName.trim() === '') {
      alert("Please enter the name of the credit customer.");
      return;
    }

    const result = await checkout({
      saleType,
      paymentMethod,
      // Pass the typed text to the checkout function
      customerName: saleType === 'credit' ? creditName : null,
      customerPhone: saleType === 'credit' ? creditPhone : null
    });

    if (result.success) {
      alert("Sale Complete!");
      setSaleType('cash');
      setCreditName('');
      setCreditPhone('');
      setPaymentMethod('zaad');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Current Order</h2>
      
      {/* --- CART ITEMS LIST --- */}
      <div className="flex-1 overflow-y-auto mb-4 min-h-[200px]">
        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center mt-10 text-gray-400 font-medium">
            Cart is empty. Click a product to add it.
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.product_id} className="flex justify-between items-center mb-3 p-2 border-b border-gray-100">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name || 'Unknown Item'}</p>
                <p className="text-sm text-gray-500">${Number(item.price || 0).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product_id, -1)} className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold">-</button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product_id, 1)} className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold">+</button>
                <button onClick={() => removeFromCart(item.product_id)} className="ml-2 text-red-500 font-bold hover:text-red-700 w-8 h-8">X</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- CHECKOUT CONTROLS --- */}
      <div className="border-t border-gray-200 pt-4 space-y-4">
        <div className="flex justify-between text-xl font-bold text-gray-900 mb-2">
          <span>Total:</span>
          <span>${Number(cartTotal || 0).toFixed(2)}</span>
        </div>

        {/* Sale Type */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sale Type</label>
          <select 
            value={saleType} 
            onChange={(e) => setSaleType(e.target.value)} 
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="cash">Cash Sale</option>
            <option value="credit">Credit Sale</option>
          </select>
        </div>

        {/* --- THE NEW CREDIT INPUT BOXES --- */}
        {saleType === 'credit' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-3">
            <div>
              <label className="block text-xs font-bold text-red-700 uppercase mb-1">Name of Credit</label>
              <input 
                type="text" 
                placeholder="Enter customer name..."
                value={creditName}
                onChange={(e) => setCreditName(e.target.value)}
                className="w-full p-2 border border-red-300 rounded outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-red-700 uppercase mb-1">Phone Number</label>
              <input 
                type="text" 
                placeholder="Enter phone number..."
                value={creditPhone}
                onChange={(e) => setCreditPhone(e.target.value)}
                className="w-full p-2 border border-red-300 rounded outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="zaad">Zaad</option>
            <option value="edahab">eDahab</option>
            <option value="cash">Physical Cash</option>
          </select>
        </div>

        <button 
          onClick={handleCheckout} 
          disabled={isLoading || cartItems.length === 0}
          className={`w-full py-3.5 font-bold rounded-lg shadow-sm transition-all duration-200 text-lg
            ${isLoading || cartItems.length === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'}`}
        >
          {isLoading ? 'Processing...' : 'Complete Sale'}
        </button>

        {error && <div className="text-red-600 text-sm text-center font-bold">{error}</div>}
      </div>
    </div>
  );
}