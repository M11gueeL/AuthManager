import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import CreateUserForm from "./CreateUserForm";
import EditUserForm from "./EditUserForm";
import Notification from "./../utils/Notification";
import ConfirmationDialog from "../utils/ConfirmationDialog";
import { getUsers, deleteUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { FiPlus, FiSearch, FiFilter, FiX, FiChevronDown } from "react-icons/fi";

const UserManagementPanel = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchField, setSearchField] = useState("all"); // 'all', 'id', 'name', 'username', 'email'
  const [searchFieldOpen, setSearchFieldOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    // Filtro por estado
    const statusFilter = 
      activeFilter === "all" ||
      (activeFilter === "active" && user.active) ||
      (activeFilter === "inactive" && !user.active);
    
    if (!statusFilter) return false;
    
    // Si no hay término de búsqueda
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    
    // Búsqueda por campo específico
    switch (searchField) {
      case "id":
        return user.id.toString().includes(term);
      case "name":
        return user.name && user.name.toLowerCase().includes(term);
      case "username":
        return user.username && user.username.toLowerCase().includes(term);
      case "email":
        return user.email && user.email.toLowerCase().includes(term);
      case "all":
      default:
        return (
          user.id.toString().includes(term) ||
          (user.name && user.name.toLowerCase().includes(term)) ||
          (user.username && user.username.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term))
        );
    }
  });

// Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const usersData = await getUsers(token);
        setUsers(usersData);
      } catch (error) {
        setNotification({
          message: `Error al cargar usuarios: ${error.message}`,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleCreateSuccess = (message) => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getUsers(token);
        setUsers(usersData);
        setNotification({ message, type: "success" });
      } catch (error) {
        setNotification({
          message: `Error al recargar usuarios: ${error.message}`,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    setShowCreateForm(false);
  };

  const handleEditSuccess = (message) => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getUsers(token);
        setUsers(usersData);
        setSelectedUser(null);
        setNotification({ message, type: "success" });
      } catch (error) {
        setNotification({
          message: `Error al recargar usuarios: ${error.message}`,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    setShowEditForm(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !token) return;
    
    try {
      setLoading(true);
      await deleteUser(selectedUser.id, token);

      const usersData = await getUsers(token);
      setUsers(usersData);
      setSelectedUser(null);

      setNotification({
        message: "Usuario eliminado exitosamente",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: `Error al eliminar usuario: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false); // Cerrar el diálogo
    }
  };

  // Manejar selección/deselección de usuario
  const handleSelectUser = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null); // Deseleccionar
    } else {
      setSelectedUser(user); // Seleccionar
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-500 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
        >
          <FiPlus className="text-lg" />
          Nuevo Usuario
        </button>
      </div>

      {!token && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
          Error de autenticación: Token no disponible
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuarios..."
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
                {searchField === "id" && "ID"}
                {searchField === "name" && "Nombre"}
                {searchField === "username" && "Username"}
                {searchField === "email" && "Email"}
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
                      ID
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
                      className={`w-full text-left px-3 py-2 rounded-md ${
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              activeFilter !== "all"
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FiFilter className="text-gray-600" />
            <span>Filtrar</span>
          </button>

          {filtersOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Estado</span>
                <button 
                  onClick={() => setFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              </div>
              <div className="p-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                    activeFilter === "all" 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveFilter("all");
                    setFiltersOpen(false);
                  }}
                >
                  Todos los usuarios
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                    activeFilter === "active" 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveFilter("active");
                    setFiltersOpen(false);
                  }}
                >
                  Usuarios activos
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeFilter === "inactive" 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveFilter("inactive");
                    setFiltersOpen(false);
                  }}
                >
                  Usuarios inactivos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Cargando usuarios...</p>
        </div>
      ) : (
        <>
          <UserTable
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser} // Usamos la nueva función
            onEdit={() => setShowEditForm(true)}
            onDelete={() => setShowDeleteConfirm(true)}
          />

          {/* Modals */}
          {showCreateForm && (
            <CreateUserForm
              onClose={() => setShowCreateForm(false)}
              onSuccess={handleCreateSuccess}
              token={token}
            />
          )}

          {showEditForm && selectedUser && (
            <EditUserForm
              user={selectedUser}
              onClose={() => setShowEditForm(false)}
              onSuccess={handleEditSuccess}
              token={token}
            />
          )}
        </>
      )}

      {/* Notification System */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Diálogo de confirmación para eliminar */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteUser}
          title="Eliminar Usuario"
          message={`¿Estás seguro de eliminar a ${selectedUser?.name || "este usuario"}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
        />
      )}
    </div>
  );
};

export default UserManagementPanel;