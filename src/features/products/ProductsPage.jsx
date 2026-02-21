import { useEffect, useState } from "react";
import { getAllProducts } from "./productsService";

import ProductsPage from "../features/products/ProductsPage";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProducts();
      console.log("Fetched:", data);
      setProducts(data);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (products.length === 0) return <p>Empty</p>;

  return (
    <div>
      <h1>Products</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;