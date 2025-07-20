import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerificarCuenta = () => {
  const { token } = useParams();
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:5000/verificar/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nueva_contraseña: nuevaContraseña }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Cuenta verificada y contraseña establecida correctamente.");
        setTimeout(() => navigate("/login"), 2000); // Redirige al login
      } else {
        setMensaje(data.error || "Error al verificar la cuenta.");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Verificar Cuenta y Establecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
        />
        <button type="submit">Establecer Contraseña</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default VerificarCuenta;
