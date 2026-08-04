import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getProducts, type Product } from "../../controllers/products";
import CheckoutForm from "./CheckoutForm";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"card" | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const stripePromise = useMemo(() => {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    return key ? loadStripe(key) : null;
  }, []);

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
      {paymentCompleted ? (
        <div className="payment-success-message">
          <h2>Pagamento concluído!</h2>
          <p>Obrigado pela sua contribuição.</p>
        </div>
      ) : selectedPayment === "card" ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={product.price}
            productName={product.name}
            onSuccess={() => setPaymentCompleted(true)}
            onCancel={() => setSelectedPayment(null)}
          />
        </Elements>
      ) : (
        <div className="buy-options">
          <h2>Opções de compra</h2>
          <p>Escolha a forma de pagamento</p>
          <ul>
            <li>
              <button onClick={() => setSelectedPayment("card")}>
                Cartão de Crédito
              </button>
            </li>
            <li>
              <button disabled>Comprar com PIX</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
