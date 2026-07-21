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
import UnifiedChat from "./components/UnifiedChat.jsx";
import ProactiveChat from "./components/ProactiveChat.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import TradeIn from "./pages/TradeIn.jsx";
import OrdersPage from "./pages/Orders.jsx";
import WishlistPage from "./pages/Wishlist.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import GoogleCallbackPage from "./pages/GoogleCallback.jsx";

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
    <div className="min-h-screen bg-cream pb-mobile-nav">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trade-in" element={<TradeIn />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      </Routes>
      <Footer />
      <CartDrawer />
      <UnifiedChat />
      <ProactiveChat />
      <MobileBottomNav />
      <PWAInstallPrompt />
    </div>
  );
}
