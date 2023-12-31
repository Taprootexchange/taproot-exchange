import "./App.scss";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import { useQueryBtcPrice } from "@/hooks/useQueryBtcPrice";
import Footer from "@/components/Footer";
function App() {
  useQueryBtcPrice();

  return (
    <div className="App">
      <Header />
      <div>
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  );
}

export default App;
