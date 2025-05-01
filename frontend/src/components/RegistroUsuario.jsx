import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("jugador");
  const [documento, setDocumento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      email,
      contraseña: password,
      rol,
    };

    // Agregar datos del jugador si es jugador
    if (rol === "jugador") {
      payload.documento = documento;
      payload.categoria = parseInt(categoria);
      payload.fecha_vencimiento_pago = fechaVencimiento;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/registrar_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje("Usuario registrado correctamente");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensaje(data.error || "Error al registrar");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="jugador">Jugador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {rol === "jugador" && (
          <>
            <div>
              <label>Documento:</label>
              <input value={documento} onChange={(e) => setDocumento(e.target.value)} required />
            </div>
            <div>
              <label>Categoría (año nacimiento):</label>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
            </div>
            <div>
              <label>Fecha vencimiento pago:</label>
              <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} required />
            </div>
          </>
        )}

        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default RegistroUsuario;

