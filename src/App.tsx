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

export default App;