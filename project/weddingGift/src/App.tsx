import { BrowserRouter, Routes, Route } from "react-router-dom";

// Componants
import Header from "./components/main/Header";
import Footer from "./components/main/Footer";

import Couple from "./components/main/Couple";
import Products from "./components/main/Products";

import CouplesHistory from "./components/history/CoupleHistory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
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
                    futuros planos? Abaixo temos as cotas para que você consiga
                    ajudar e participar da história deles!
                  </p>
                </div>
                <Products />
              </>
            }
          />
          <Route path="/history" element={<CouplesHistory />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
