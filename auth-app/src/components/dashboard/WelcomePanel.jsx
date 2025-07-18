import React from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiShield, 
  FiActivity,
  FiCoffee,
  FiBarChart2,
  FiBell
} from "react-icons/fi";

const WelcomePanel = () => {
  const { userProfile } = useAuth();

  // Obtener el saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Calcular tiempo desde el inicio de sesión
  const getSessionDuration = () => {
    if (!userProfile?.session?.start_date) return "No disponible";
    
    const start = new Date(userProfile.session.start_date);
    const now = new Date();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Hace unos momentos";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="space-y-8">
      {/* Tarjeta de bienvenida */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}{userProfile?.name ? `, ${userProfile.name}` : ''}!
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Bienvenido al panel de administración. Aquí puedes gestionar usuarios, 
              revisar sesiones y configurar tu sistema de autenticación.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                <FiClock className="text-blue-600 mr-2" />
                <span className="text-gray-700">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                <FiActivity className="text-green-600 mr-2" />
                <span className="text-gray-700">
                  Sesión activa: {getSessionDuration()}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 shadow-lg">
            <FiCoffee className="text-white text-4xl" />
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Usuarios totales</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">42</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUser className="text-blue-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <span className="text-green-600 font-medium">+3</span> desde ayer
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sesiones activas</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiActivity className="text-green-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <span className="text-red-600 font-medium">-2</span> desde ayer
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sesiones hoy</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCalendar className="text-purple-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <span className="text-green-600 font-medium">+8</span> desde ayer
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tareas pendientes</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiBell className="text-yellow-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <span className="text-green-600 font-medium">-1</span> completada hoy
          </p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué te gustaría hacer hoy?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-blue-100 p-3 rounded-lg mb-3">
                  <FiUser className="text-blue-600 text-xl" />
                </div>
                <span className="font-medium text-gray-800">Añadir usuario</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-green-100 p-3 rounded-lg mb-3">
                  <FiShield className="text-green-600 text-xl" />
                </div>
                <span className="font-medium text-gray-800">Revisar permisos</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-purple-100 p-3 rounded-lg mb-3">
                  <FiBarChart2 className="text-purple-600 text-xl" />
                </div>
                <span className="font-medium text-gray-800">Ver estadísticas</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="bg-yellow-100 p-3 rounded-lg mb-3">
                  <FiBell className="text-yellow-600 text-xl" />
                </div>
                <span className="font-medium text-gray-800">Ver notificaciones</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje inspirador */}
      <div className="text-center py-8">
        <p className="text-gray-600 italic max-w-2xl mx-auto">
          "La mejor manera de predecir el futuro es creándolo. Cada acción que tomas hoy 
          construye el sistema de mañana."
        </p>
        <p className="mt-2 text-gray-500">- Equipo de desarrollo</p>
      </div>
    </div>
  );
};

export default WelcomePanel;