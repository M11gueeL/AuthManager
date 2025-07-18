// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { logout as apiLogout } from "../api/auth";
import { getSessions } from "../api/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Cambiamos a authLoading
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    setAuthLoading(false); // Actualizado
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setLogoutLoading(true);
    setLogoutError(null);

    try {
      if (token) {
        await apiLogout(token);
      }
      localStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
    } catch (err) {
      setLogoutError(err.message || "Error al cerrar sesión");
      localStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Memoizar fetchSessions con useCallback
  const fetchSessions = useCallback(async () => {
    if (!token) return;
    
    try {
      setSessionsLoading(true);
      const sessionsData = await getSessions(token);
      setSessions(sessionsData);
      setSessionsError(null);
    } catch (err) {
      setSessionsError(err.message || "Error al cargar sesiones");
      console.error("Error fetching sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, [token]); // Dependencia: token

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        authLoading, // Actualizado
        logoutLoading,
        logoutError,
        login,
        logout,
        sessions,
        sessionsLoading,
        sessionsError,
        fetchSessions, // Añadido para obtener sesiones
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
