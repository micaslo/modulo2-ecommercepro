import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import BestSellersPage from "./pages/bestSellersPage/BestSellersPage";
import "./App.css";
import HowToGetThere from "./pages/How-to-get-there/How-to-get-there";

function App() {
  return (
    <BrowserRouter>
      <Navbar cartCount={0} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Contenido</h1>
                <HowToGetThere />
              </>
            }
          />
          <Route path="/mas-vendidos" element={<BestSellersPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;