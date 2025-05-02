import React, { useState } from "react";

const EditarUsuario = ({ usuario, onClose, onUsuarioActualizado }) => {
  const [usuarioEditado, setUsuarioEditado] = useState(usuario);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado({ ...usuarioEditado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioEditado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioEditado),
      });

      if (response.ok) {
        alert("Usuario actualizado correctamente");
        onUsuarioActualizado(); // Notifica al componente padre que el usuario fue actualizado
        onClose(); // Cierra el formulario
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <div>
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={usuarioEditado.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={usuarioEditado.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select name="rol" value={usuarioEditado.rol} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="jugador">Jugador</option>
          </select>
        </div>
        <div>
          <label>Documento:</label>
          <input
            type="text"
            name="documento"
            value={usuarioEditado.documento || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input
            type="number"
            name="categoria"
            value={usuarioEditado.categoria || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Estado:</label>
          <select name="estado" value={usuarioEditado.estado} onChange={handleChange}>
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>
        </div>
        <div>
          <label>Fecha de Vencimiento:</label>
          <input
            type="date"
            name="fecha_vencimiento_pago"
            value={usuarioEditado.fecha_vencimiento_pago || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditarUsuario;