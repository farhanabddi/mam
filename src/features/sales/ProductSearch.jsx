import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useCart } from './useCart';

export default function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Bring in the addToCart function from our master hook
  const { addToCart } = useCart();

  // Fetch products when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        // Ensure we always set an array, even if data is null
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setProducts([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // THE CRITICAL FIX: (products || []) prevents the .filter() crash
  const filteredProducts = (products || []).filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search for a product..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center p-8 text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {filteredProducts.map(product => (
              <button 
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={!product.is_service && product.stock <= 0}
                className={`p-4 rounded-lg shadow border text-left flex flex-col justify-between h-32 transition-colors
                  ${!product.is_service && product.stock <= 0 
                    ? 'bg-gray-100 opacity-60 cursor-not-allowed' 
                    : 'bg-white hover:bg-blue-50 hover:border-blue-300'}`}
              >
                <div>
                  <h3 className="font-bold text-gray-800 line-clamp-2">{product.name}</h3>
                  <p className="text-blue-600 font-semibold mt-1">
                    ${Number(product.price || 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  {product.is_service ? (
                    <span className="text-purple-600 font-medium">Service</span>
                  ) : (
                    <span>Stock: <span className={product.stock <= 5 ? 'text-red-500 font-bold' : ''}>{product.stock}</span></span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}