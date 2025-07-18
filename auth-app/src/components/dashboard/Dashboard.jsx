// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserManagementPanel from "../users/UserManagementPanel";
import UserSessionHistoryPanel from "../users/UserSessionHistoryPanel";

const Dashboard = () => {
  const { logout, logoutLoading, logoutError } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100  flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Administración
          </h1>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className={`px-4 py-2 rounded-md font-medium ${
              logoutLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white hover:scale-105"

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
            {["overview", "users", "history"].map((tab) => (
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
                {tab === "history" && "Historial de Sesiones"}
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
              Bienvenido al mi proyecto autenticación de usuarios con CRUD
            </p>
          </div>
        )}

        {activeTab === "users" && <UserManagementPanel />}

        {activeTab === "history" && <UserSessionHistoryPanel />}
      </main>
    </div>
  );
};

export default Dashboard;
