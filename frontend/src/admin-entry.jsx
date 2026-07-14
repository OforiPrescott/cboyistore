import React from "react";
import ReactDOM from "react-dom/client";
import AdminApp from "./admin/AdminApp.jsx";
import ErrorBoundary from "./admin/ErrorBoundary.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AdminApp />
    </ErrorBoundary>
  </React.StrictMode>
);
