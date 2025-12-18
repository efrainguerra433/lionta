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
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviandoCorreo(true);

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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(`Usuario registrado correctamente. Se ha enviado un correo a ${email} con las instrucciones para activar la cuenta.`);
        // Limpiamos los campos del formulario
        setNombre("");
        setEmail("");
        setPassword("");
        setDocumento("");
        setCategoria("");
        setFechaVencimiento("");
        // No redireccionamos automáticamente para que el admin pueda ver el mensaje
      } else {
        setMensaje(data.error || "Error al registrar");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setMensaje("Error al conectar con el servidor");
    } finally {
      setEnviandoCorreo(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Rol:</label>
          <select 
            value={rol} 
            onChange={(e) => setRol(e.target.value)}
            className="form-control"
          >
            <option value="jugador">Jugador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {rol === "jugador" && (
          <>
            <div className="form-group">
              <label>Documento:</label>
              <input 
                value={documento} 
                onChange={(e) => setDocumento(e.target.value)} 
                required 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Categoría (año nacimiento):</label>
              <input 
                type="number"
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)} 
                required 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Fecha vencimiento pago:</label>
              <input 
                type="date" 
                value={fechaVencimiento} 
                onChange={(e) => setFechaVencimiento(e.target.value)} 
                required 
                className="form-control"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={enviandoCorreo}
        >
          {enviandoCorreo ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {mensaje && (
        <div className={mensaje.includes("Error") ? "error-message" : "success-message"}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default RegistroUsuario;