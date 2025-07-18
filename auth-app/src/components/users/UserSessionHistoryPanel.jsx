// src/components/users/UserSessionHistoryPanel.jsx
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import SessionTable from "./SessionTable";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";

const UserSessionHistoryPanel = () => {
  const { 
    token, 
    sessions, 
    sessionsLoading, 
    sessionsError, 
    fetchSessions 
  } = useAuth();

  // Usar useEffect con dependencia de fetchSessions (que ahora está memoizada)
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]); // Solo se ejecuta cuando fetchSessions cambia

  const handleRefresh = () => {
    fetchSessions();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Historial de Sesiones
          </h2>
          <p className="text-gray-500 mt-1">
            Registro de inicios de sesión de los usuarios
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={sessionsLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium ${
            sessionsLoading
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white hover:scale-105"
          } transition-all shadow-md hover:shadow-lg`}
        >
          <FiRefreshCw className={`${sessionsLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {!token && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
          <FiAlertCircle className="text-xl" />
          Error de autenticación: Token no disponible
        </div>
      )}

      {sessionsError && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
          <FiAlertCircle className="text-xl" />
          {sessionsError}
        </div>
      )}

      <SessionTable sessions={sessions} loading={sessionsLoading} />
    </div>
  );
};

export default UserSessionHistoryPanel;