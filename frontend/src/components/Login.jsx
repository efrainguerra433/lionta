import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { isLoggedIn, setIsLoggedIn, setUser, user } = useContext(AuthContext); // Usa el contexto

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      setIsLoggedIn(true);
      setUser(JSON.parse(localStorage.getItem("user"))); // Recupera la información del usuario
      setMensaje("Bienvenido de nuevo"); // Mensaje predeterminado
    }
  }, [setIsLoggedIn, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        localStorage.setItem("token", data.token); // Guarda el token
        localStorage.setItem("isLoggedIn", true); // Guarda el estado de sesión
        localStorage.setItem("user", JSON.stringify(data.usuario)); // Guarda la información del usuario
        setIsLoggedIn(true); // Actualiza el estado global
        setUser(data.usuario); // Guarda la información del usuario en el estado global
        setMensaje(`Bienvenido, ${data.usuario.nombre} (${data.usuario.rol})`);
      } else {
        setMensaje(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  const handleLogout = () => {
    // Elimina los datos de sesión
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Actualiza el estado global
    setUser(null); // Limpia la información del usuario
    setMensaje("Has cerrado sesión correctamente.");
  };

  return (
    <div>
      {isLoggedIn ? ( // Si está logueado, muestra el mensaje de bienvenida y el botón de cerrar sesión
        <div>
          <h2>Bienvenido, {user?.nombre} ({user?.rol})</h2>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : ( // Si no está logueado, muestra el formulario de login
        <div>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>} {/* Muestra mensajes de error o de cierre de sesión */}
    </div>
  );
};

export default Login;