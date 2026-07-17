/**
 * This file contains the logic to fetch and build the products data for the wedding gift project.
 */
interface Product {
  // Product interface to define the structure of a product object
  name: string;
  src: string;
  price: number;
}

interface ProductsData {
  // ProductsData interface to define the structure of the data returned from the fetch request
  products: Product[];
}

// Function to fetch products data from the public JSON endpoint
export async function getProducts(): Promise<Product[] | undefined> {
  try {
    const response = await fetch("/data.json");

    if (!response.ok) {
      throw new Error(`Bad request - Data not found.`);
    }

    const data = (await response.json()) as ProductsData;
    return data.products;
  } catch (error) {
    console.error(`Data not fetched ${error}`);
  }
}

// Function to build the HTML for the products data
export default async function buildProducts() {
  try {
    const data = await getProducts();

    let html = "";

    if (!data) {
      html = "<p>No products found.</p>";
    } else {
      data.forEach((product) => {
        html += `
                <div className="product">
                    <h3>${product.name}</h3>
                    <img src="${product.src}" alt="${product.name} image" />
                    <p>Preço: R$${product.price}</p>
                    <button>Compre!</button>
                </div>
                `;
      });
    }

    return html;
  } catch (error) {
    console.log(`Something went wrong with the build products.ts: ${error}`);
  }
}
