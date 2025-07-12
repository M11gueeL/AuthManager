// src/components/users/UserTable.jsx
import React from "react";

const UserTable = ({ users, selectedUser, onSelectUser, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      {/* Tabla de usuarios */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Seleccionar
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Username
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className={`${
                  selectedUser?.id === user.id
                    ? "bg-indigo-50"
                    : "hover:bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="radio"
                    name="selectedUser"
                    checked={selectedUser?.id === user.id}
                    onChange={() => onSelectUser(user)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.username || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3 justify-end">
        <button
          onClick={onEdit}
          disabled={!selectedUser}
          className={`px-4 py-2 rounded-md font-medium ${
            !selectedUser
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } transition-colors`}
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          disabled={!selectedUser}
          className={`px-4 py-2 rounded-md font-medium ${
            !selectedUser
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          } transition-colors`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default UserTable;
