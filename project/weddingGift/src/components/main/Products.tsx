import { useEffect, useState } from "react";
import { getProducts, type Product } from "../../controllers/products";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products data when the component mounts
  useEffect(() => {
    let isMounted = true;

    // Function to load products data
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Call the function to load products data
    void loadProducts();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Render loading state, no products state, or the list of products
  if (loading) {
    return (
      <div className="products">
        <p>Loading products...</p>
      </div>
    );
  }

  // Render no products state if the products array is empty
  if (products.length === 0) {
    return (
      <div className="products">
        <p>No products found.</p>
      </div>
    );
  }

  // Render the list of products
  return (
    <div className="products">
      {products.map((product) => (
        <div className="product" key={product.name}>
          <h3>{product.name}</h3>
          <img src={product.src} alt={`${product.name} image`} />
          <p>Preço: R${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
