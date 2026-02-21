import { useState, useEffect } from 'react';
import { fetchProducts } from './productService';

export default function useProducts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchProducts().then(setItems);
  }, []);

  return items;
}
