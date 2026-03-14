import React, { useState } from 'react';

export default function CartSection({ customers = [], cart }) {
  // Unpack the shared cart functions and data
  const { cartItems, cartTotal, isLoading, error, updateQuantity, removeFromCart, checkout } = cart;
  
  // Local state for the checkout form
  const [saleType, setSaleType] = useState('cash'); 
  const [paymentMethod, setPaymentMethod] = useState('zaad');
  const [customerId, setCustomerId] = useState('');

  const handleCheckout = async () => {
    // Block credit sales if no customer is selected
    if (saleType === 'credit' && !customerId) {
      alert("Please select a registered customer for this credit sale.");
      return;
    }

    const result = await checkout({
      saleType,
      paymentMethod,
      customerId: saleType === 'credit' ? customerId : null
    });

    if (result.success) {
      alert(`Sale Complete! Receipt: ${result.receipt?.receipt_number || 'Success'}`);
      // Reset the form after a successful sale
      setSaleType('cash');
      setCustomerId('');
      setPaymentMethod('zaad');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // Find the selected customer's details to display in the UI
  const selectedCustomer = customers.find(c => c.id === customerId);

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
                <button 
                  onClick={() => updateQuantity(item.product_id, -1)} 
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product_id, 1)} 
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 font-bold"
                >
                  +
                </button>
                <button 
                  onClick={() => removeFromCart(item.product_id)} 
                  className="ml-2 text-red-500 font-bold hover:text-red-700 w-8 h-8 flex items-center justify-center"
                >
                  X
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- CHECKOUT CONTROLS --- */}
      <div className="border-t border-gray-200 pt-4 space-y-4">
        
        {/* Total Price */}
        <div className="flex justify-between text-xl font-bold text-gray-900 mb-2">
          <span>Total:</span>
          <span>${Number(cartTotal || 0).toFixed(2)}</span>
        </div>

        {/* Sale Type Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sale Type</label>
          <select 
            value={saleType} 
            onChange={(e) => {
              setSaleType(e.target.value);
              if (e.target.value === 'cash') setCustomerId(''); // Clear customer if switching back to cash
            }} 
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all"
          >
            <option value="cash">Cash Sale</option>
            <option value="credit">Credit Sale</option>
          </select>
        </div>

        {/* Credit Customer Details (ONLY SHOWS IF CREDIT IS SELECTED) */}
        {saleType === 'credit' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-3 animate-fade-in">
            <label className="block text-xs font-bold text-red-700 uppercase">Select Credit Customer</label>
            
            <select 
              value={customerId} 
              onChange={(e) => setCustomerId(e.target.value)} 
              className="w-full p-2.5 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
            >
              <option value="">-- Choose a Registered Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Display the selected customer's Name and Phone */}
            {selectedCustomer ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white p-2 border border-red-100 rounded shadow-sm">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Name</span>
                  <span className="text-sm font-semibold text-gray-800 line-clamp-1">{selectedCustomer.name}</span>
                </div>
                <div className="bg-white p-2 border border-red-100 rounded shadow-sm">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Phone</span>
                  <span className="text-sm font-semibold text-gray-800 line-clamp-1">{selectedCustomer.phone || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-red-600 font-medium">
                * You must select a customer to complete this sale.
              </p>
            )}
          </div>
        )}

        {/* Payment Method Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all"
          >
            <option value="zaad">Zaad</option>
            <option value="edahab">eDahab</option>
            <option value="cash">Physical Cash</option>
          </select>
        </div>

        {/* Complete Sale Button */}
        <button 
          onClick={handleCheckout} 
          disabled={isLoading || cartItems.length === 0 || (saleType === 'credit' && !customerId)}
          className={`w-full py-3.5 font-bold rounded-lg shadow-sm transition-all duration-200 text-lg
            ${isLoading || cartItems.length === 0 || (saleType === 'credit' && !customerId)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:transform active:scale-95'}`}
        >
          {isLoading ? 'Processing...' : 'Complete Sale'}
        </button>

        {/* Database Error Display */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}