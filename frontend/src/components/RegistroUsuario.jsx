import React, { useState } from "react";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    email: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/registrar_usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.mensaje); // Muestra un mensaje de éxito
      } else {
        alert("Error: " + data.mensaje); // Muestra un mensaje de error
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al registrar el usuario.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="documento" className="form-label">Documento:</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label">Contraseña:</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;