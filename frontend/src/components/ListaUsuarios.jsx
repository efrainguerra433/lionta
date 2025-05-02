import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto

const ListaUsuarios = () => {
  const { user } = useContext(AuthContext); // Obtén el usuario actual del contexto
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Verifica si el usuario tiene el rol de admin
    if (user?.rol !== "admin") {
      setError("Acceso denegado: Solo los administradores pueden ver esta página.");
      return;
    }

    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token"); // Obtén el token del localStorage
      try {
        const response = await fetch("http://127.0.0.1:5000/usuarios", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Envía el token en el encabezado
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data); // Guarda la lista de usuarios
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Error al obtener usuarios");
        }
      } catch (err) {
        setError("Error de conexión con el servidor");
      }
    };

    fetchUsuarios();
  }, [user]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Muestra el error si ocurre
  }

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Documento</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Fecha de Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.documento || "N/A"}</td>
                <td>{usuario.categoria || "N/A"}</td>
                <td>{usuario.estado ? "Activo" : "Inactivo"}</td>
                <td>{usuario.fecha_vencimiento_pago || "N/A"}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaUsuarios;