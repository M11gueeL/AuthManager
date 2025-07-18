import React from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  FiUser, 
  FiMail, 
  FiKey, 
  FiClock, 
  FiMonitor, 
  FiMapPin, 
  FiRefreshCw,
  FiShield,
  FiLogOut
} from "react-icons/fi";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const UserProfilePanel = () => {
    const { 
    userProfile, 
    profileLoading, 
    profileError, 
    fetchUserProfile,
    logout
  } = useAuth();

  const handleRefresh = () => {
    fetchUserProfile();
  };

  const handleLogout = () => {
    logout();
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Error al cargar el perfil</h3>
          <p className="text-gray-500 mb-4">{profileError}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <FiRefreshCw />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-gray-500 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Perfil no disponible</h3>
          <p className="text-gray-500">No se pudo cargar la información del perfil</p>
        </div>
      </div>
    );
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'En curso';
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  };

  // Función para simplificar el user agent
  const simplifyUserAgent = (userAgent) => {
    if (!userAgent) return 'Desconocido';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Postman')) return 'Postman';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return userAgent.substring(0, 20) + (userAgent.length > 20 ? '...' : '');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Mi Perfil
          </h2>
          <p className="text-gray-500 mt-1">
            Información de tu cuenta y sesión actual
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <FiRefreshCw />
            Actualizar
          </button>
          
        </div>
      </div>

      {/* User Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <FiUser className="text-blue-600 text-4xl" />
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{userProfile.name}</h3>
                  <p className="text-gray-500">@{userProfile.username}</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Administrador
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiMail className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{userProfile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiKey className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500">ID de Usuario</p>
                    <p className="text-gray-900 font-medium">{userProfile.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiShield className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <p className="text-gray-900 font-medium">Administrador</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiClock className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500">Miembro desde</p>
                    <p className="text-gray-900 font-medium">Jul 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Sesiones activas</span>
                <span className="text-sm font-medium text-gray-900">1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Sesiones totales</span>
                <span className="text-sm font-medium text-gray-900">42</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Actividad reciente</span>
                <span className="text-sm font-medium text-gray-900">Alta</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-600 h-2 rounded-full" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-purple-100">
            <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Ver estadísticas completas
            </button>
          </div>
        </div>
      </div>

      {/* Current Session Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Sesión Actual</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            userProfile.session?.active 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {userProfile.session?.active ? "Activa" : "Cerrada"}
          </span>
        </div>
        
        {userProfile.session ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <FiClock className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Detalles de Tiempo</h4>
                  <p className="text-sm text-gray-500">Duración y actividad</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Inicio</span>
                  <span className="font-medium">{formatDate(userProfile.session.start_date)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Última actividad</span>
                  <span className="font-medium">Hace 5 minutos</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Duración</span>
                  <span className="font-medium">2 horas 15 min</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FiMonitor className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dispositivo</h4>
                  <p className="text-sm text-gray-500">Información del cliente</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Navegador</span>
                  <span className="font-medium">{simplifyUserAgent(userProfile.session.user_agent)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Sistema</span>
                  <span className="font-medium">Windows 11</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Dirección IP</span>
                  <span className="font-medium">{userProfile.session.ip_address}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
            <FiMonitor className="inline-block text-3xl text-gray-400 mb-3" />
            <p>No hay información de sesión disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePanel;