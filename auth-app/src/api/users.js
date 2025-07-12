const API_URL = "http://localhost/authmanager/authmanagerapi/users/";

export const getUsers = async (token) => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener usuarios");
  }

  // Cambio importante: manejar diferentes formatos de respuesta
  const data = await response.json();

  // Si la respuesta es un array, devolverlo directamente
  if (Array.isArray(data)) {
    return data;
  }

  // Si la respuesta tiene una propiedad "users"
  if (data.users && Array.isArray(data.users)) {
    return data.users;
  }

  // Si la respuesta tiene una propiedad "data"
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }

  throw new Error("Formato de respuesta inesperado");
};

export const getUser = async (id, token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  const response = await fetch(`${API_URL}${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Token inválido o expirado");
  }

  if (!response.ok) throw new Error("Error al obtener usuario");
  return await response.json();
};

export const createUser = async (userData, token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (response.status === 401) {
    throw new Error("Token inválido o expirado");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear usuario");
  }

  return await response.json();
};

export const updateUser = async (id, userData, token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  const response = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (response.status === 401) {
    throw new Error("Token inválido o expirado");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al actualizar usuario");
  }

  return await response.json();
};

export const deleteUser = async (id, token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  const response = await fetch(`${API_URL}${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Token inválido o expirado");
  }

  if (!response.ok) throw new Error("Error al eliminar usuario");
  return await response.json();
};
