import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/layout";
import PublicRoute from "./routes/PublicRoute";
import LoginPage from "./pages/auth//LoginPage";
import Dashboard from "./pages/dashboard/dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              {/* Ruta para dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Redirige la raíz a dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Captura cualquier ruta no definida */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
