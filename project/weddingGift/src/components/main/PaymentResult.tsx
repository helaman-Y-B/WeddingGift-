import { Link } from "react-router-dom";

type PaymentResultProps = {
  success: boolean;
};

export default function PaymentResult({ success }: PaymentResultProps) {
  return (
    <section
      className={`payment-result ${success ? "payment-result--success" : "payment-result--canceled"}`}
      aria-live="polite"
    >
      <span className="payment-result-icon" aria-hidden="true">
        {success ? "✓" : "×"}
      </span>
      <h1>{success ? "Obrigado pelo presente!" : "Pagamento não concluído"}</h1>
      <p>
        {success
          ? "Seu pagamento foi concluído com sucesso. Agradecemos por fazer parte deste momento tão especial!"
          : "Seu pagamento foi cancelado e nenhuma cobrança foi concluída. Você pode voltar e tentar novamente quando quiser."}
      </p>
      <Link to="/" className="payment-result-link">
        {success ? "Voltar para o início" : "Voltar às cotas"}
      </Link>
    </section>
  );
}
