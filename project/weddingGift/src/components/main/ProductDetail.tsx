import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, type Product } from "../../controllers/products";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleStripeCheckout = async () => {
    if (!product) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(product.price * 100),
          // productId: "insert_stripe_product_id_here",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao criar sessão de checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(
        err instanceof Error
          ? err.message
          : "Erro ao redirecionar para o Stripe Checkout.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === id);

        if (isMounted) {
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        console.error("Failed to load product", err);
        if (isMounted) {
          setError("Failed to load product");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to products
        </button>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to products
        </button>
        <p>{error || "Product not found"}</p>
      </div>
    );
  }

  const hasSubtitle =
    typeof product.subTitle === "string" && product.subTitle.trim() !== "";

  return (
    <>
      <div className="product-detail">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to products
        </button>
        <div className="product-detail-content">
          <img
            src={product.src}
            alt={`${product.name} image`}
            className="product-detail-image"
            loading="lazy"
          />
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            {hasSubtitle && <h3>{product.subTitle}</h3>}
            <p className="price">R${product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="buy-options">
        <h2>Opções de compra</h2>
        <p>Escolha a forma de pagamento</p>
        <ul>
          <li>
            <button onClick={handleStripeCheckout} disabled={checkoutLoading}>
              {checkoutLoading
                ? "Redirecionando..."
                : "Pagar com Stripe Checkout"}
            </button>
          </li>
          <li>
            <button disabled>Comprar com PIX</button>
          </li>
        </ul>
        {checkoutError && <p className="payment-error">{checkoutError}</p>}
      </div>
    </>
  );
}
