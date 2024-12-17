import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import AdminDashboard from "./admin/AdminDashboard";
import InsertProduct from "./admin/InsertProduct";
import CardData from "./pages/CardData";
import ProductDetail from "./pages/ProductDeatil";
import Cart from "./pages/Cart";


import Search from "./pages/Search";
import Shop from "./pages/Shop";

import Checkout from "./pages/Checkout";
import ThankYou from "./components/ThankYou";
import Failed from "../src/components/Failed";

// import Header from './components/Header'

const App = () => {
  return (
    <>
      {/* <h1>Welcome to E-commerceWeb!!!</h1> */}
      {/* <Header/> */}
      
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="carddata" element={<CardData />} />
            <Route path="prodetail/:proid" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
        
            <Route path="search" element={<Search/>}/>
            <Route path="shop" element={<Shop/>}/>
    
            <Route path="checkout" element={<Checkout/>}/>
            <Route path="thankyou" element={<ThankYou/>}/>
            <Route path="failed" element={<Failed/>}/>
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="insertpro" element={<InsertProduct />} />
            <Route path="ahome" element={<Home/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
