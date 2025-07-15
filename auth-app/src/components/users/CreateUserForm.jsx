import React, { useState } from "react";
import { createUser } from "../../api/users";
import { FiUser, FiAtSign, FiLock, FiX, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

const CreateUserForm = ({ onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nombre es requerido";
    if (!formData.username.trim()) newErrors.username = "Username es requerido";
    if (!formData.email.trim()) newErrors.email = "Email es requerido";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) 
      newErrors.email = "Email inválido";
    
    if (!formData.password) newErrors.password = "Contraseña es requerida";
    else if (formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await createUser(formData, token);
      onSuccess(response.message);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || "Error al crear el usuario" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparente bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start animate-fadeIn">
              <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-2 text-red-600" />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none transition-colors ${
                    errors.name 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-red-500 text-sm flex items-center animate-fadeIn">
                  <FiAlertCircle className="mr-1" size={14} /> {errors.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nombre de usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiAtSign className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none transition-colors ${
                    errors.username 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-red-500 text-sm flex items-center animate-fadeIn">
                  <FiAlertCircle className="mr-1" size={14} /> {errors.username}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiAtSign className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none transition-colors ${
                    errors.email 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-red-500 text-sm flex items-center animate-fadeIn">
                  <FiAlertCircle className="mr-1" size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Campo de Contraseña Actual */}
<div className="mb-4">
  <label className="block text-gray-700 mb-2">Contraseña</label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiLock className="text-gray-400" />
    </div>
    <input
      type={showPassword ? "text" : "password"} // Alternar tipo
      name="password"
      value={formData.password}
      onChange={handleChange}
      className={`w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none transition-colors ${
        errors.password 
          ? "border-red-300 focus:border-red-500" 
          : "border-gray-200 focus:border-blue-500"
      }`}
      placeholder="••••••"
    />
    {/* Botón para mostrar/ocultar */}
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
    </button>
  </div>
  {errors.password && (
    <p className="mt-1.5 text-red-500 text-sm flex items-center animate-fadeIn">
      <FiAlertCircle className="mr-1" size={14} /> {errors.password}
    </p>
  )}
</div>

{/* Nuevo Campo: Confirmación de Contraseña */}
<div className="mb-6">
  <label className="block text-gray-700 mb-2">Confirmar Contraseña</label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiLock className="text-gray-400" />
    </div>
    <input
      type={showConfirmPassword ? "text" : "password"} // Alternar tipo
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      className={`w-full pl-10 pr-10 py-2.5 border rounded-xl focus:outline-none transition-colors ${
        errors.confirmPassword 
          ? "border-red-300 focus:border-red-500" 
          : "border-gray-200 focus:border-blue-500"
      }`}
      placeholder="••••••"
    />
    {/* Botón para mostrar/ocultar */}
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
      </button>
    </div>
    {errors.confirmPassword && (
      <p className="mt-1.5 text-red-500 text-sm flex items-center animate-fadeIn">
        <FiAlertCircle className="mr-1" size={14} /> {errors.confirmPassword}
      </p>
    )}
  </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </>
                ) : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;