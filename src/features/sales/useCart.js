import { useState, useMemo } from 'react';
import { salesService } from './salesService';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Cart Operations ---
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      
      if (existing) {
        // Prevent adding more than stock (UI protection)
        if (!product.is_service && existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      return [...prev, { 
        product_id: product.id, 
        name: product.name,
        price: Number(product.selling_price || product.price), // Handled depending on your frontend prop name
        quantity: 1,
        is_service: product.is_service,
        max_stock: product.stock
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId));
  };
  
  const updateQuantity = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1 || (!item.is_service && newQty > item.max_stock)) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  // --- UI Calculations Only ---
  // The frontend calculates this ONLY to show the cashier the number on screen.
  // It is NOT sent to the database. The database recalculates this securely.
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  // --- The Secure Checkout Flow ---
  const checkout = async (checkoutDetails) => {
    if (cartItems.length === 0) return { success: false, error: "Cart is empty" };
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Build the minimalist, secure payload
      const payload = {
        sale_type: checkoutDetails?.saleType || 'cash',
        payment_method: checkoutDetails?.paymentMethod || 'cash',
        customer_id: checkoutDetails?.customerId || null, // Required if sale_type is 'credit'
        
        // Notice: No prices, no totals. Just IDs and Quantities.
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      console.log("Sending secure payload to backend:", payload);

      // 2. Send to the new Database RPC
      const result = await salesService.processTransaction(payload);
      
      // 3. Success! Clear cart
      clearCart();
      return { success: true, receipt: result.receipt, backendTotal: result.total };

    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    cartItems, 
    cartTotal, 
    isLoading, 
    error, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    checkout 
  };
};