import { useState, useMemo } from 'react';
import { salesService } from './salesService';
import { supabase } from '../../services/supabaseClient'; // We need Supabase here to register the customer

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            product_id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            quantity: 1,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product_id === productId) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const checkout = async ({ saleType, paymentMethod, customerName, customerPhone }) => {
    setIsLoading(true);
    setError(null);
    try {
      let finalCustomerId = null;

      // THE TRICK: If it is a credit sale, auto-register them to get an ID!
      if (saleType === 'credit') {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert([{ 
            name: customerName, 
            phone: customerPhone || 'No Phone' 
          }])
          .select('id')
          .single();

        if (customerError) {
          throw new Error("Could not register the new credit customer: " + customerError.message);
        }
        
        // Grab the newly generated database ID
        finalCustomerId = newCustomer.id;
      }

      // Build the payload exactly how your working backend expects it
      const payload = {
        sale_type: saleType,
        payment_method: paymentMethod,
        customer_id: finalCustomerId, // <-- We send the ID instead of text, preventing the decline!
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      };

      const result = await salesService.processTransaction(payload);
      clearCart();
      return { success: true, receipt: result };
      
    } catch (err) {
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
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout
  };
}