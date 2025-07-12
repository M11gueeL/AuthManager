// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserManagementPanel from "../users/UserManagementPanel";

const Dashboard = () => {
  const { logout, logoutLoading, logoutError } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Administración
          </h1>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className={`px-4 py-2 rounded-md font-medium ${
              logoutLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            } transition-colors`}
          >
            {logoutLoading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["overview", "users", "settings"].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "overview" && "Resumen"}
                {tab === "users" && "Usuarios"}
                {tab === "settings" && "Configuración"}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {logoutError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {logoutError}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Resumen del Sistema
            </h2>
            <p className="text-gray-600">
              Bienvenido al panel de administración
            </p>
          </div>
        )}

        {activeTab === "users" && <UserManagementPanel />}

        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Configuración de la Cuenta
            </h2>
            <p className="text-gray-600">
              Opciones de configuración del sistema
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
