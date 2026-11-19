import { BrowserRouter, } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
// import BestSellersPage from "./pages/bestSellersPage/BestSellersPage";
import "./App.css";
import HowToGetThere from "./pages/How-to-get-there/How-to-get-there";
import PageToCreateAnAccount from "./pages/CreateAnAccount/CreateAnAccount";

function App() {
  return (
    <BrowserRouter>
      <Navbar cartCount={0} />
      <main>
        <h1>Contenido</h1>
        <HowToGetThere/>
        <PageToCreateAnAccount/>
      </main>
    </BrowserRouter>
  );
}

function TempNotFound() {
  return <h1 style={{ padding: "2rem" }}>404</h1>;
}

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<TempHome />} /> */}
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
export default App;