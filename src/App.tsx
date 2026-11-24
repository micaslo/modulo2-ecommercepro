import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import BestSellersPage from "./pages/bestSellersPage/BestSellersPage";
import Footer from "./components/footer/footer";
import "./App.css";
import HowToGetThere from "./pages/How-to-get-there/How-to-get-there";
import PageToCreateAnAccount from "./pages/CreateAnAccount/CreateAnAccount";
import ProductPage from "./pages/productPage/ProductPage";
import CartPage from "./pages/cartPage/CartPage";
import Error404 from "./pages/Error-404/Error-404";
import SellProductSection from "./components/sellProduct/SellProductSection";
import ButtonWsp from "./components/ButtonWsp/ButtonWsp";
import TilliBot from "./components/TilliBot/TilliBot";
import ResellersSection from "./pages/ResellersSection/ResellersSection";
import { useCart } from "./hooks/useCart";
import WishList from "./pages/WishList/WishList";

import SobreNosotros from "./components/sobrenosotros/sobrenosotros";

function App() {
  const { totalItems, subtotal } = useCart();

  return (
    <>
      <Navbar cartCount={totalItems} cartTotal={subtotal} />
      <Routes>
      <Route
  path="/"
  element={
    <main>
      <h1>Contenido</h1>
      <BestSellersPage />
      <HowToGetThere />
      <PageToCreateAnAccount />
      <ResellersSection />
      <WishList />
    </main>
  }
/>
        <Route
          path="/"
          element={
            <main>
              <h1>Contenido</h1>
              <HowToGetThere />
              <PageToCreateAnAccount />
              <ResellersSection />
              <WishList />
            </main>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/resellers" element={<ResellersSection />} />
        <Route path="/sell-my-product" element={<SellProductSection />} />
        <Route path="/favoritos" element={<WishList />} />
        <Route path="/resellers" element={<ResellersSection />} />
        <Route path="/error-404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
      <TilliBot />
      <ButtonWsp />
    </>
  );
    <Routes>
      <Route path="/" element={<h1>Home - DeTodito Market</h1>} />
      <Route path="/sobrenosotros" element={<SobreNosotros />} />
      <Route path="/productos" element={<h1>Productos</h1>} />
    </Routes>

}

export default App;