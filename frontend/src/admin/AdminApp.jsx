import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, useAdmin } from "./AdminContext.jsx";
import Sidebar from "./Sidebar.jsx";
import LoginScreen from "./LoginScreen.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import TradeInPage from "./pages/TradeInPage.jsx";
import WorkersPage from "./pages/WorkersPage.jsx";
import AuditLogPage from "./pages/AuditLogPage.jsx";
import CouponsPage from "./pages/CouponsPage.jsx";

function Shell() {
  const { isAuthed, workerInfo } = useAdmin();
  const [navOpen, setNavOpen] = useState(false);
  if (!isAuthed) return <LoginScreen />;
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex" />

        <div className="flex flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient font-display text-sm font-700 text-white">
                C
              </span>
              <span className="font-display text-sm font-700 text-ink">Cboyistore CMS</span>
              {workerInfo && (
                <span className="text-[11px] text-ink/50 capitalize">{workerInfo.role}</span>
              )}
            </div>
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="focus-ring rounded-xl border border-ink/10 p-2 text-ink/60"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/trade-in" element={<TradeInPage />} />
              <Route path="/workers" element={<WorkersPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="/coupons" element={<CouponsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Mobile slide-over nav */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setNavOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}
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
