import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (token && loggedIn) {
      setIsLoggedIn(true);
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  // Función para iniciar sesión
  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          contraseña: password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Si se autenticó correctamente
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(data.usuario));
        }
        setIsLoggedIn(true);
        setUser(data.usuario);
        return data;
      } else {
        // Si hubo un error de autenticación
        const errorMsg = data.error || "Error al iniciar sesión";
        setLoginError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error en login:", error);
      const errorMsg = error.message || "Error de conexión con el servidor";
      setLoginError(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        setIsLoggedIn, 
        user, 
        setUser, 
        login, 
        logout,
        isLoading,
        loginError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};