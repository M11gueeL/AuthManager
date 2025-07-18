export const login = async (credentials) => {
  // Simulación de llamada API
  const response = await fetch(
    "http://localhost/authmanager/authmanagerapi/public/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) throw new Error("Error de autenticación");

  const data = await response.json();
  return data.token;
};

export const logout = async (token) => {
  try {
    const response = await fetch(
      "http://localhost/authmanager/authmanagerapi/public/auth/logout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cerrar sesión en el servidor");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en logout:", error);
    throw error;
  }
};

export const getSessions = async (token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  try {
    const response = await fetch(
      "http://localhost/authmanager/authmanagerapi/public/auth/sessions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Intentar obtener mensaje de error del cuerpo de la respuesta
      let errorMsg = "Error al obtener las sesiones";
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {
        // Si no podemos parsear el error, usar el status
        errorMsg = `${errorMsg} (${response.status})`;
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getSessions:", error);
    throw error;
  }
};

// Función para obtener el perfil del usuario autenticado
export const getUserProfile = async (token) => {
  
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  try {
    const response = await fetch(
      "http://localhost/authmanager/authmanagerapi/public/auth/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el perfil del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener los datos del usuario", error);
    throw error;
  }
};
