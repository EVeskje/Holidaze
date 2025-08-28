import "./App.css";
import { Header } from "../src/components/Layout/Header";
import { Home } from "./pages/Home/index";
import { Footer } from "./components/Layout/Footer";

function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;
