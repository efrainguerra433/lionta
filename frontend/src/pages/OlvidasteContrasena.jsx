// src/components/OlvidasteContrasena.js
import React, { useState } from "react";

const OlvidasteContrasena = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleEnviar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(data.mensaje || "Correo enviado. Revisa tu bandeja de entrada.");
        setError("");
      } else {
        setError(data.error || "Error al enviar el correo.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleEnviar}>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar enlace</button>
      </form>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default OlvidasteContrasena;
