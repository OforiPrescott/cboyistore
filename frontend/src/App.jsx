import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ServiceRibbon from "./components/ServiceRibbon.jsx";
import Shop from "./components/Shop.jsx";
import WhyUs from "./components/WhyUs.jsx";
import LocationMap from "./components/LocationMap.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import TradeIn from "./pages/TradeIn.jsx";
import OrdersPage from "./pages/Orders.jsx";

function Home() {
  return (
    <>
      <Hero />
      <ServiceRibbon />
      <Shop />
      <WhyUs />
      <LocationMap />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trade-in" element={<TradeIn />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
      </Routes>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
