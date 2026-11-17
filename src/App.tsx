import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import "./App.css";

function App() {
  return (
    <>
       <BrowserRouter>
      <Navbar cartCount={0} />
      <main>
        <h1>Contenido</h1>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App;