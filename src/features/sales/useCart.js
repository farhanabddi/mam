import { useState, useMemo } from 'react';
import { salesService } from './salesService';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Function to handle clicking a product box
  const addToCart = (product) => {
    console.log("🖱️ Product Clicked! Adding to cart:", product); // <--- DEBUGGING LINE

    setCartItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find((item) => item.product_id === product.id);
      
      if (existingItem) {
        // If it is, just increase the quantity by 1
        return prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it's not, add it to the cart list as a brand new item
        return [
          ...prevItems,
          {
            product_id: product.id,
            name: product.name,
            price: Number(product.price || 0), // Safe math
            quantity: 1,
          },
        ];
      }
    });
  };

  // 2. Function to handle the + and - buttons in the cart
  const updateQuantity = (productId, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product_id === productId) {
          const newQuantity = item.quantity + change;
          // Don't let quantity drop below 1 using the minus button
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  };

  // 3. Function to handle the red X button
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Automatically calculate the total price
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // 5. Send the final data to the database
  const checkout = async ({ saleType, paymentMethod, customerId }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build the exact JSON format your Supabase database is expecting
      const payload = {
        sale_type: saleType,
        payment_method: paymentMethod,
        customer_id: customerId,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      };

      console.log("🛒 Preparing to send payload to Supabase:", payload);

      const result = await salesService.processTransaction(payload);
      
      // If it succeeds, empty the cart
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