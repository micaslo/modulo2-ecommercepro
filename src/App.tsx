import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/footer";
import ButtonWsp from "./components/buttonWsp/ButtonWsp";
import TilliBot from "./components/tilliBot/TilliBot";
import SellProductSection from "./components/sellProduct/SellProductSection";
import AboutUs from "./components/aboutUs/AboutUs";
import BlackFridayBanner from "./components/blackFridayBanner/BlackFridayBanner";
import Hero from "./pages/hero/Hero";
import BestSellersPage from "./pages/bestSellersPage/BestSellersPage";
import CatalogPage from "./pages/catalogPage/CatalogPage";
import CategoryPage from "./pages/categoryPage/CategoryPage";
import HowToGetThere from "./pages/howToGetThere/How-to-get-there";
import PageToCreateAnAccount from "./pages/createAnAccount/CreateAnAccount";
import ProductPage from "./pages/productPage/ProductPage";
import CartPage from "./pages/cartPage/CartPage";
import Error404 from "./pages/error404/Error-404";
import ResellersSection from "./pages/resellersSection/ResellersSection";
import WishList from "./pages/wishList/WishList";
import ProfilePage from "./pages/profilePage/ProfilePage";
import AdminPage from "./pages/adminPage/AdminPage";
import LoginPage from "./pages/loginPage/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useCart } from "./hooks/useCart";
import "./App.css";

function App() {
  const { totalItems, subtotal } = useCart();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar cartCount={totalItems} cartTotal={subtotal} />}

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
        <Route path="/sobrenosotros" element={<AboutUs />} />
        <Route path="/sobre-nosotros" element={<Navigate to="/sobrenosotros" replace />} />
        <Route path="/nosotros" element={<Navigate to="/sobrenosotros" replace />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/categoria/:slug" element={<CategoryPage />} />
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
        <Route path="/productos/:category/:id" element={<ProductPage />} />
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

      {!isLoginPage && (
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
