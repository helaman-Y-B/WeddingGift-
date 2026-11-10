import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { lazy, Suspense } from "react";

// Components
import Header from "./components/main/Header";
import Footer from "./components/main/Footer";

const Couple = lazy(() => import("./components/main/Couple"));
const Products = lazy(() => import("./components/main/Products"));
const ProductDetail = lazy(() => import("./components/main/ProductDetail"));
const PaymentResult = lazy(() => import("./components/main/PaymentResult"));

function App() {
  return (
    <>
      <Analytics />
      <BrowserRouter>
        <Header />
        <main>
          <Suspense fallback={<div>Carregando...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Couple />
                    <div id="cotasInfo">
                      <h2>As cotas</h2>
                      <p>Estamos animados para ver todos vocês!</p>
                      <p>
                        Como todos sabem, começar um casamento não é muito barato,
                        então fizemos essas cotas para aqueles que gostariam de nos
                        ajudar nessa nova jornada da nossa vida.
                      </p>
                      <p>
                        Escolha uma das cotas abaixo e contribua para que possamos
                        realizar nossos sonhos e construir juntos um futuro ainda
                        mais especial!
                      </p>
                      <p>
                        Toda ajuda é bem-vinda. Quem quiser contribuir com um valor
                        diferente dos disponíveis nas cotas pode fazer um Pix usando
                        a chave abaixo.
                      </p>
                      <p>Chave Pix: nickyoletta21@gmail.com</p>
                    </div>
                    <Products />
                  </>
                }
              />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route
                path="/payment/success"
                element={<PaymentResult success />}
              />
              <Route
                path="/payment/canceled"
                element={<PaymentResult success={false} />}
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
