import React, { useState, useEffect } from "react";
import UserTable from "./userTable";
import CreateUserForm from "./CreateUserForm";
import EditUserForm from "./EditUserForm";
import Notification from "../../components/ui/notification";
import { getUsers, deleteUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

const UserManagementPanel = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (user) =>
      user.id.toString().includes(searchTerm) ||
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

    if (
      window.confirm(
        `¿Estás seguro de eliminar a ${selectedUser.name || "este usuario"}?`
      )
    ) {
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
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Administración de Usuarios
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
        >
          + Nuevo Usuario
        </button>
      </div>

      {!token && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          Error de autenticación: Token no disponible
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por ID, nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <UserTable
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            onEdit={() => setShowEditForm(true)}
            onDelete={handleDeleteUser}
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
    </div>
  );
};

export default UserManagementPanel;
