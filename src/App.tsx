import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/footer";
import ButtonWsp from "./components/ButtonWsp/ButtonWsp";
import TilliBot from "./components/TilliBot/TilliBot";
import SellProductSection from "./components/sellProduct/SellProductSection";
import SobreNosotros from "./components/sobrenosotros/sobrenosotros";
import BlackFridayBanner from "./components/blackFridayBanner/BlackFridayBanner";
import Hero from "./pages/Hero/Hero";
import BestSellersPage from "./pages/bestSellersPage/BestSellersPage";
import CatalogPage from "./pages/catalogPage/CatalogPage";
import HowToGetThere from "./pages/How-to-get-there/How-to-get-there";
import PageToCreateAnAccount from "./pages/CreateAnAccount/CreateAnAccount";
import ProductPage from "./pages/productPage/ProductPage";
import CartPage from "./pages/cartPage/CartPage";
import Error404 from "./pages/Error-404/Error-404";
import ResellersSection from "./pages/ResellersSection/ResellersSection";
import WishList from "./pages/WishList/WishList";
import ProfilePage from "./pages/profilePage/ProfilePage";
import AdminPage from "./pages/adminPage/AdminPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useCart } from "./hooks/useCart";
import "./App.css";

function App() {
  const { totalItems, subtotal } = useCart();
  const location = useLocation();
  const esLogin = location.pathname === "/login";

  return (
    <>
      {!esLogin && <Navbar cartCount={totalItems} cartTotal={subtotal} />}

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <BlackFridayBanner />
              <BestSellersPage />
              <HowToGetThere />
            </main>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/sobre-nosotros" element={<Navigate to="/sobrenosotros" replace />} />
        <Route path="/nosotros" element={<Navigate to="/sobrenosotros" replace />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/mas-vendidos" element={<BestSellersPage />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute sectionName="tu perfil">
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
              sectionName="el panel de administración"
            >
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute sectionName="tu lista de deseos">
              <WishList />
            </ProtectedRoute>
          }
        />
        <Route path="/productos/:categoria/:id" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/resellers" element={<ResellersSection />} />
        <Route path="/sell-my-product" element={<SellProductSection />} />
        <Route path="/registro" element={<PageToCreateAnAccount />} />
        <Route path="/crear-cuenta" element={<PageToCreateAnAccount />} />
        <Route path="/como-llegar" element={<HowToGetThere />} />
        <Route path="/error-404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

      {!esLogin && (
        <>
          <Footer />
          <TilliBot />
          <ButtonWsp />
        </>
      )}
    </>
  );
}

export default App;
