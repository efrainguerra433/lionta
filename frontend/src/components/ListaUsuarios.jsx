import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto
import EditarUsuario from "./EditarUsuario"; // Asegúrate de importar el componente EditarUsuario
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate

const ListaUsuarios = () => {
  const { user } = useContext(AuthContext); // Obtén el usuario actual del contexto
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

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

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/usuario/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Error al eliminar: Código ${response.status}`);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };
  
  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario); // Guarda el usuario seleccionado
  };
  
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
              <th>Acciones</th>
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
                <td>
                  <button onClick={() => handleEditar(usuario)}>Editar</button>
                  <button onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
                  <button onClick={() => navigate(`/usuario/${usuario.id}/metricas`)}>Registrar Métrica</button>
                  <button onClick={() => navigate(`/registrar-estadisticas/${usuario.id}`)}>Registrar Estadística</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {usuarioSeleccionado && (
        <EditarUsuario
          usuario={usuarioSeleccionado}
          onClose={() => setUsuarioSeleccionado(null)} // Cierra el formulario
          onUsuarioActualizado={() => {
            // Actualiza la lista de usuarios después de editar
            const fetchUsuarios = async () => {
              try {
                const response = await fetch("http://127.0.0.1:5000/usuarios");
                const data = await response.json();
                setUsuarios(data);
              } catch (error) {
                console.error("Error al actualizar la lista de usuarios:", error);
              }
            };

            fetchUsuarios();
          }}
        />
      )}
    </div>
  );
};

export default ListaUsuarios;
