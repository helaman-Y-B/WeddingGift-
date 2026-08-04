import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

type CheckoutFormProps = {
  amount: number;
  productName: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function CheckoutForm({
  amount,
  productName,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Não foi possível carregar o campo do cartão.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Math.round(amount * 100) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pagamento.");
      }

      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: productName,
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Pagamento recusado.");
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess();
      } else {
        setErrorMessage("Falha ao processar o pagamento.");
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao processar o pagamento.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Pagamento com Cartão</h2>
      <p>Valor: R${amount.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        <div className="card-element-wrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {errorMessage && <p className="payment-error">{errorMessage}</p>}
        <div className="checkout-actions">
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="primary-button"
          >
            {loading ? "Processando..." : "Pagar"}
          </button>
        </div>
      </form>
    </div>
  );
}
