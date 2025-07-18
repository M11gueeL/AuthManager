// src/components/users/SessionTable.jsx
import React, { useState, useEffect } from "react";
import { FiUser, FiClock, FiMonitor, FiMapPin, FiChevronDown, FiX, FiCalendar, FiFilter } from "react-icons/fi";
import { format, parseISO, isWithinInterval, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

const SessionTable = ({ sessions, loading }) => {
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all"); // 'all', 'id', 'name', 'username', 'email', 'device'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'closed'
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'last7', 'last30', 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("start_date");
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc' or 'desc'
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchFieldOpen, setSearchFieldOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  // Aplicar filtros y ordenación
  useEffect(() => {
    if (loading || !sessions) return;
    
    let result = [...sessions];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(session => {
        switch (searchField) {
          case "id":
            return session.session_id.toString().includes(term);
          case "name":
            return session.name?.toLowerCase().includes(term);
          case "username":
            return session.username?.toLowerCase().includes(term);
          case "email":
            return session.email?.toLowerCase().includes(term);
          case "device":
            return session.user_agent?.toLowerCase().includes(term);
          case "all":
          default:
            return (
              session.session_id.toString().includes(term) ||
              session.name?.toLowerCase().includes(term) ||
              session.username?.toLowerCase().includes(term) ||
              session.email?.toLowerCase().includes(term) ||
              session.user_agent?.toLowerCase().includes(term)
            );
        }
      });
    }
    
    // Aplicar filtro de estado
    if (statusFilter !== "all") {
      result = result.filter(session => {
        if (statusFilter === "active") return session.active === 1;
        if (statusFilter === "closed") return session.active === 0;
        return true;
      });
    }
    
    // Aplicar filtro de fecha
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter(session => {
        const sessionDate = parseISO(session.start_date);
        
        switch (dateFilter) {
          case "today":
            return format(sessionDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
          case "last7":
            const sevenDaysAgo = subDays(now, 7);
            return isWithinInterval(sessionDate, { start: sevenDaysAgo, end: now });
          case "last30":
            const thirtyDaysAgo = subDays(now, 30);
            return isWithinInterval(sessionDate, { start: thirtyDaysAgo, end: now });
          case "custom":
            if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
              end.setHours(23, 59, 59, 999); // Incluir todo el día final
              return isWithinInterval(sessionDate, { start, end });
            }
            return true;
          default:
            return true;
        }
      });
    }
    
    // Aplicar ordenación
    result.sort((a, b) => {
      let fieldA, fieldB;
      
      if (sortField === "start_date") {
        fieldA = new Date(a.start_date);
        fieldB = new Date(b.start_date);
      } else if (sortField === "device") {
        fieldA = a.user_agent?.toLowerCase() || '';
        fieldB = b.user_agent?.toLowerCase() || '';
      } else if (sortField === "status") {
        fieldA = a.active;
        fieldB = b.active;
      } else {
        return 0;
      }
      
      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
    
    setFilteredSessions(result);
  }, [sessions, loading, searchTerm, searchField, statusFilter, dateFilter, startDate, endDate, sortField, sortDirection]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'En curso';
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  };

  // Simplificar user agent
  const simplifyUserAgent = (userAgent) => {
    if (!userAgent) return 'Desconocido';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Postman')) return 'Postman';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return userAgent.substring(0, 20) + (userAgent.length > 20 ? '...' : '');
  };

  // Cambiar ordenación
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setSearchField("all");
    setStatusFilter("all");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Cargando sesiones...</p>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiClock className="text-gray-500 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay sesiones registradas</h3>
        <p className="text-gray-500">No se encontraron registros de sesiones</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMonitor className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar sesiones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-32 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          
          {/* Selector de campo de búsqueda */}
          <div className="absolute inset-y-0 right-0 flex items-center">
            <div className="relative">
              <button
                onClick={() => setSearchFieldOpen(!searchFieldOpen)}
                className="flex items-center gap-1 px-3 py-1.5 h-full text-sm text-gray-500 hover:text-gray-700 border-l border-gray-200"
              >
                {searchField === "all" && "Todos los campos"}
                {searchField === "id" && "ID Sesión"}
                {searchField === "name" && "Nombre"}
                {searchField === "username" && "Username"}
                {searchField === "email" && "Email"}
                {searchField === "device" && "Dispositivo"}
                <FiChevronDown className="ml-1" />
              </button>
              
              {searchFieldOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <div className="p-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                        searchField === "all" 
                          ? "bg-blue-50 text-blue-700 font-medium" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSearchField("all");
                        setSearchFieldOpen(false);
                      }}
                    >
                      Todos los campos
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                        searchField === "id" 
                          ? "bg-blue-50 text-blue-700 font-medium" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSearchField("id");
                        setSearchFieldOpen(false);
                      }}
                    >
                      ID Sesión
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                        searchField === "name" 
                          ? "bg-blue-50 text-blue-700 font-medium" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSearchField("name");
                        setSearchFieldOpen(false);
                      }}
                    >
                      Nombre
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                        searchField === "username" 
                          ? "bg-blue-50 text-blue-700 font-medium" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSearchField("username");
                        setSearchFieldOpen(false);
                      }}
                    >
                      Username
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                        searchField === "email" 
                          ? "bg-blue-50 text-blue-700 font-medium" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSearchField("email");
                        setSearchFieldOpen(false);
                      }}
                    >
                      Email
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        searchField === "device" 
                          ? "bg-blue-50 text-blue-700 font-medium" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSearchField("device");
                        setSearchFieldOpen(false);
                      }}
                    >
                      Dispositivo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
                statusFilter !== "all" || dateFilter !== "all"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FiFilter className="text-gray-600" />
              <span>Filtros</span>
            </button>

            {filtersOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">Filtros avanzados</h3>
                    <button 
                      onClick={() => setFiltersOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado de sesión
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={statusFilter === "all"}
                          onChange={() => setStatusFilter("all")}
                        />
                        <span className="ml-2 text-gray-700">Todos los estados</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={statusFilter === "active"}
                          onChange={() => setStatusFilter("active")}
                        />
                        <span className="ml-2 text-gray-700">Sesiones activas</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={statusFilter === "closed"}
                          onChange={() => setStatusFilter("closed")}
                        />
                        <span className="ml-2 text-gray-700">Sesiones cerradas</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fechas
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={dateFilter === "all"}
                          onChange={() => setDateFilter("all")}
                        />
                        <span className="ml-2 text-gray-700">Todas las fechas</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={dateFilter === "today"}
                          onChange={() => setDateFilter("today")}
                        />
                        <span className="ml-2 text-gray-700">Hoy</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={dateFilter === "last7"}
                          onChange={() => setDateFilter("last7")}
                        />
                        <span className="ml-2 text-gray-700">Últimos 7 días</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={dateFilter === "last30"}
                          onChange={() => setDateFilter("last30")}
                        />
                        <span className="ml-2 text-gray-700">Últimos 30 días</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={dateFilter === "custom"}
                          onChange={() => setDateFilter("custom")}
                        />
                        <span className="ml-2 text-gray-700">Personalizado</span>
                      </label>
                    </div>
                  </div>
                  
                  {dateFilter === "custom" && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Desde
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hasta
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Limpiar todos los filtros
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setDateFilterOpen(!dateFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiCalendar className="text-gray-600" />
              <span>Ordenar</span>
              <FiChevronDown />
            </button>
            
            {dateFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden">
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                      sortField === "start_date" && sortDirection === "desc" 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      toggleSort("start_date");
                      setDateFilterOpen(false);
                    }}
                  >
                    Fecha (más reciente)
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                      sortField === "start_date" && sortDirection === "asc" 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSortField("start_date");
                      setSortDirection("asc");
                      setDateFilterOpen(false);
                    }}
                  >
                    Fecha (más antigua)
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                      sortField === "device" 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      toggleSort("device");
                      setDateFilterOpen(false);
                    }}
                  >
                    Dispositivo (A-Z)
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      sortField === "status" 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      toggleSort("status");
                      setDateFilterOpen(false);
                    }}
                  >
                    Estado (activo primero)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="mb-4 text-sm text-gray-500">
        Mostrando {filteredSessions.length} de {sessions.length} sesiones
      </div>

      {/* Tabla de sesiones */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dispositivo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("start_date")}
              >
                <div className="flex items-center">
                  Inicio
                  {sortField === "start_date" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fin
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center">
                  Estado
                  {sortField === "status" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSessions.map((session) => (
              <tr key={session.session_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <FiUser className="text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{session.name}</div>
                      <div className="text-sm text-gray-500">@{session.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiMonitor className="text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {simplifyUserAgent(session.user_agent)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiMapPin className="text-gray-400 mr-2" />
                    {session.ip_address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <FiClock className="inline mr-2 text-gray-400" />
                  {formatDate(session.start_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <FiClock className="inline mr-2 text-gray-400" />
                  {formatDate(session.end_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    session.active === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {session.active === 1 ? 'Activa' : 'Cerrada'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mensaje cuando no hay resultados */}
      {filteredSessions.length === 0 && sessions.length > 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="text-gray-500 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron sesiones</h3>
          <p className="text-gray-500">Intenta ajustando tus filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default SessionTable;