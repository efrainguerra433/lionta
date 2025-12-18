// src/components/CambiarContrasena.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CambiarContrasena = () => {
  const { token } = useParams();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/restablecer-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nueva_contrasena: nuevaContrasena }),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(data.mensaje || "Contraseña cambiada correctamente.");
        setError("");
      } else {
        setError(data.error || "No se pudo cambiar la contraseña.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          required
        />
        <button type="submit">Cambiar contraseña</button>
      </form>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CambiarContrasena;
