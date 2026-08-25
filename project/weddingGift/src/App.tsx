import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { lazy, Suspense } from "react";

// Components
import Header from "./components/main/Header";
import Footer from "./components/main/Footer";

const Couple = lazy(() => import("./components/main/Couple"));
const Products = lazy(() => import("./components/main/Products"));
const ProductDetail = lazy(() => import("./components/main/ProductDetail"));
const CouplesHistory = lazy(() => import("./components/history/CoupleHistory"));

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
                      <p>
                        Queremos convidar você a fazer parte dos próximos
                        capítulos da nossa história. Escolha uma das cotas abaixo
                        e contribua para que possamos realizar nossos sonhos e
                        construir juntos um futuro ainda mais especial!
                      </p>
                    </div>
                    <Products />
                  </>
                }
              />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/history" element={<CouplesHistory />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
