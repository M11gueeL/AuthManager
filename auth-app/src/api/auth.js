export const login = async (credentials) => {
  // Simulación de llamada API
  const response = await fetch(
    "http://localhost/authmanager/authmanagerapi/auth/login",
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
      "http://localhost/authmanager/authmanagerapi/auth/logout",
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
