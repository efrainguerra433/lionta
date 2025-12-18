import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EditarUsuario from "../components/EditarUsuario";
import { useNavigate } from "react-router-dom";
import "./ListaUsuarios.css"; // Asegúrate de crear este archivo CSS

const ListaUsuarios = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [rolFiltro, setRolFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user?.rol !== "admin") {
      setError("Acceso denegado: Solo los administradores pueden ver esta página.");
      setCargando(false);
      return;
    }

    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      try {
        setCargando(true);
        const response = await fetch("http://127.0.0.1:5000/usuarios", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
          setCargando(false);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Error al obtener usuarios");
          setCargando(false);
        }
      } catch (err) {
        setError("Error de conexión con el servidor");
        setCargando(false);
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
    setUsuarioSeleccionado(usuario);
  };

  const getCategorias = () => {
    // Obtener todas las categorías únicas de los usuarios
    const categorias = [...new Set(usuarios.map(u => String(u.categoria || "")).filter(Boolean))];
    return categorias.sort((a, b) => a.localeCompare(b));
  };

  const getRoles = () => {
    // Obtener todos los roles únicos de los usuarios
    const roles = [...new Set(usuarios.map(u => String(u.rol || "")).filter(Boolean))];
    return roles.sort((a, b) => a.localeCompare(b));
  };

  // Filtrar la lista de usuarios según los filtros
  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideTexto = filtro === "" || 
      usuario.nombre?.toLowerCase().includes(filtro.toLowerCase()) || 
      usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.documento?.toLowerCase().includes(filtro.toLowerCase());
    
    const coincideCategoria = categoriaFiltro === "" || 
      usuario.categoria === categoriaFiltro;
    
    const coincideRol = rolFiltro === "" || 
      usuario.rol === rolFiltro;
    
    const coincideEstado = estadoFiltro === "" || 
      (estadoFiltro === "activo" && usuario.estado) ||
      (estadoFiltro === "inactivo" && !usuario.estado);

    return coincideTexto && coincideCategoria && coincideRol && coincideEstado;
  });

  const limpiarFiltros = () => {
    setFiltro("");
    setCategoriaFiltro("");
    setRolFiltro("");
    setEstadoFiltro("");
  };
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Lista de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => navigate("/registro")}>
          Nuevo Usuario
        </button>
      </div>

      {cargando ? (
        <div className="loading-indicator">
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <>
          <div className="filtros-container">
            <div className="filtro-busqueda">
              <input
                type="text"
                placeholder="Buscar por nombre, email o documento..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="filtros-selectores">
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {getCategorias().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={rolFiltro}
                onChange={(e) => setRolFiltro(e.target.value)}
              >
                <option value="">Todos los roles</option>
                {getRoles().map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <button className="btn-outline" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          </div>

          {usuariosFiltrados.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron usuarios con los filtros actuales.</p>
            </div>
          ) : (
            <div className="tabla-container">
              <table className="tabla-usuarios">
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
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className={usuario.estado ? "" : "usuario-inactivo"}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre || "N/A"}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`badge badge-${usuario.rol}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td>{usuario.documento || "N/A"}</td>
                      <td>{usuario.categoria || "N/A"}</td>
                      <td>
                        <span className={`estado-badge ${usuario.estado ? "activo" : "inactivo"}`}>
                          {usuario.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>{usuario.fecha_vencimiento_pago || "N/A"}</td>
                      <td className="acciones">
                        <button className="action-btn edit-btn" onClick={() => handleEditar(usuario)} title="Editar usuario">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleEliminar(usuario.id)} title="Eliminar usuario">
                          <i className="fas fa-trash"></i>
                        </button>
                        <button className="action-btn view-btn" onClick={() => navigate(`/usuario/${usuario.id}/metricas`)} title="Registrar métrica">
                          <i className="fas fa-chart-line"></i>
                        </button>
                        <button className="action-btn view-btn" onClick={() => navigate(`/registrar-estadisticas/${usuario.id}`)} title="Registrar estadística">
                          <i className="fas fa-clipboard"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {usuarioSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-container">
            <EditarUsuario
              usuario={usuarioSeleccionado}
              onClose={() => setUsuarioSeleccionado(null)}
              onUsuarioActualizado={() => {
                const fetchUsuarios = async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const response = await fetch("http://127.0.0.1:5000/usuarios", {
                      headers: {
                        "Authorization": `Bearer ${token}`,
                      },
                    });
                    const data = await response.json();
                    setUsuarios(data);
                  } catch (error) {
                    console.error("Error al actualizar la lista de usuarios:", error);
                  }
                };

                fetchUsuarios();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaUsuarios;