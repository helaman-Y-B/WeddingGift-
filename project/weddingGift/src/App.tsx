import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <BrowserRouter>
        <Header />
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
                      Você gostaria de ajudar este maravilhoso casal com os seus
                      futuros planos? Abaixo temos as cotas para que você
                      consiga ajudar e participar da história deles!
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
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
