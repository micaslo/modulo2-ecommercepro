import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import "./App.css";
import HowToGetThere from "./pages/How-to-get-there/How-to-get-there";

function App() {
  return (
    <>
       <BrowserRouter>
      <Navbar cartCount={0} />
      <main>
        <h1>Contenido</h1>
        <HowToGetThere/>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App;