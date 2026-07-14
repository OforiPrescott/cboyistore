import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, useAdmin } from "./AdminContext.jsx";
import Sidebar from "./Sidebar.jsx";
import LoginScreen from "./LoginScreen.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import TradeInPage from "./pages/TradeInPage.jsx";

function Shell() {
  const { isAuthed } = useAdmin();
  if (!isAuthed) return <LoginScreen />;
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/trade-in" element={<TradeInPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AdminProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </AdminProvider>
  );
}
