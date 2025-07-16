import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../api/auth";
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = await login({ username, password });
      authLogin(token);
      navigate("/dashboard");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
      // Animación de error
      const form = document.querySelector(".login-form");
      form.classList.remove("shake");
      setTimeout(() => form.classList.add("shake"), 10);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in-down">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FiLock className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
          <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="login-form bg-white rounded-2xl border border-gray-200 p-8 shadow-xl animate-float-in"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start animate-pulse-once">
              <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <FiArrowRight className="text-white transform rotate-180" />
              </div>
              <div>
                <p className="font-medium text-red-700">Credenciales incorrectas</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm transition-colors font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow hover:shadow-md disabled:opacity-80 flex items-center justify-center group relative overflow-hidden"
          >
            <span className={`transition-transform duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              Iniciar Sesión
            </span>
            {loading && (
              <svg className="animate-spin absolute h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span className="absolute right-4 transform group-hover:translate-x-1 transition-transform">
              <FiArrowRight />
            </span>
          </button>
        </form>
      </div>
      
      <style>{`
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(-20px);
        }
        
        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float-in {
          animation: floatIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        @keyframes floatIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pulse-once {
          animation: pulseOnce 1.5s ease-in-out;
        }
        
        @keyframes pulseOnce {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;