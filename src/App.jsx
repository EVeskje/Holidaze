import "./App.css";
import { Header } from "./components/nav/Layout/Header";
import { Home } from "./pages/Home/index";
import { Footer } from "./components/nav/Layout/Footer";

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
