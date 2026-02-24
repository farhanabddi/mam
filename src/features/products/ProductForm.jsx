import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProductForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    is_service: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: formData.is_service ? 0 : parseInt(formData.stock, 10)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input 
        id="name"
        label="Product/Service Name" 
        required 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          id="price"
          label="Price ($)" 
          type="number" 
          step="0.01" 
          min="0"
          required 
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
        />
        
        {!formData.is_service && (
          <Input 
            id="stock"
            label="Initial Stock" 
            type="number" 
            min="0"
            required 
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
          />
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox" 
          id="is_service"
          className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
          checked={formData.is_service}
          onChange={(e) => setFormData({...formData, is_service: e.target.checked})}
        />
        <label htmlFor="is_service" className="text-sm text-gray-700 font-medium">
          This is a Service (No inventory tracking)
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;