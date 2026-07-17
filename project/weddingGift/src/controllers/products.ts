/**
 * This file contains the logic to fetch and build the products data for the wedding gift project.
 */
export interface Product {
  name: string;
  src: string;
  price: number;
}

interface ProductsData {
  products: Product[];
}

// Function to fetch products data from the public JSON endpoint
export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/data.json");

  if (!response.ok) {
    throw new Error("Bad request - Data not found.");
  }

  // Parse the JSON response and return the products array
  const data = (await response.json()) as ProductsData;
  return data.products;
}
