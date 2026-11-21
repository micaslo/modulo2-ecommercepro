import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
// import BestSellersPage from "./pages/bestSellersPage/BestSellersPage";
import Footer from "./components/footer/footer";
import "./App.css";
import HowToGetThere from "./pages/How-to-get-there/How-to-get-there";
import PageToCreateAnAccount from "./pages/CreateAnAccount/CreateAnAccount";
import ProductPage from "./pages/productPage/ProductPage";
import Error404 from "./pages/Error-404/Error-404";
import ButtonWsp from "./components/ButtonWsp/ButtonWsp";
import ResellersSection from "./pages/ResellersSection/ResellersSection";

function App() {
  return (
    <>
      <Navbar cartCount={0} />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <h1>Contenido</h1>
              <HowToGetThere />
              <PageToCreateAnAccount />
              <ResellersSection />
            </main>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/resellers" element={<ResellersSection />} />
        <Route path="/error-404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
      <ButtonWsp />
    </>
  );
}

export default App;

