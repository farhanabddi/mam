import React, { useState } from 'react';
import { useProducts } from './useProducts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProductForm from './ProductForm';

const ProductsPage = () => {
  const { products, isLoading, error, addProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = async (data) => {
    const result = await addProduct(data);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products & Services</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Add New</Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Product/Service</h2>
            <ProductForm 
              onSubmit={handleAddProduct} 
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={isLoading}
            />
          </Card>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && products.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading database...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No products found. Add one above.</td></tr>
              ) : (
                products.map(prod => (
                  <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{prod.name}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        prod.is_service ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {prod.is_service ? 'Service' : 'Product'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {prod.is_service ? '-' : prod.stock}
                    </td>
                    <td className="p-4 text-sm font-bold text-emerald-600 text-right">
                      ${prod.price.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProductsPage;