import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, type Product } from "../../controllers/products";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            setError("Produto não encontrado.");
          }
        }
      } catch (err) {
        console.error("Failed to load product", err);
        if (isMounted) {
          setError("Não foi possível carregar o produto.");
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
          ← Voltar para as cotas
        </button>
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <button onClick={() => navigate("/")} className="back-button">
          ← Voltar para as cotas
        </button>
        <p>{error || "Produto não encontrado."}</p>
      </div>
    );
  }

  const hasSubtitle =
    typeof product.subTitle === "string" && product.subTitle.trim() !== "";

  return (
    <>
      <div className="product-detail">
        <button onClick={() => navigate("/")} className="back-button">
          ← Voltar para as cotas
        </button>
        <div className="product-detail-content">
          <img
            src={product.src}
            alt={product.name}
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
        <h2>Pagar com PIX</h2>
        <a className="pix-payment-link" href={product.pixUrl}>
          Continuar para o pagamento
        </a>
      </div>
    </>
  );
}
