import React, { useEffect, useState } from "react";

const VisualizarEstadisticas = () => {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [usuarioId, setUsuarioId] = useState(null); // Usuario seleccionado
  const [estadisticas, setEstadisticas] = useState([]); // Estadísticas del usuario seleccionado
  const [totales, setTotales] = useState({}); // Totales de estadísticas
  const [error, setError] = useState("");
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);

  // Obtener la lista de usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoadingUsuarios(true);
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
          setUsuarios(data);
          setUsuarioId(data[0]?.id || null); // Selecciona el primer usuario por defecto
        } else {
          setError("Error al obtener la lista de usuarios");
        }
      } catch (error) {
        setError("Error al conectar con el servidor");
      } finally {
        setLoadingUsuarios(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Obtener las estadísticas del usuario seleccionado
  useEffect(() => {
    if (!usuarioId) return;

    const fetchEstadisticas = async () => {
      setLoadingEstadisticas(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}/estadisticas`);
        if (response.ok) {
          const data = await response.json();
          setEstadisticas(data); // Guardar las estadísticas del usuario seleccionado
          calcularTotales(data); // Calcular los totales
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Error al obtener las estadísticas");
        }
      } catch (error) {
        setError("Error al conectar con el servidor");
      } finally {
        setLoadingEstadisticas(false);
      }
    };

    fetchEstadisticas();
  }, [usuarioId]);

  // Calcular los totales de las estadísticas
  const calcularTotales = (data) => {
    const totalGoles = data.reduce((sum, stat) => sum + stat.goles, 0);
    const totalAsistencias = data.reduce((sum, stat) => sum + stat.asistencias, 0);
    const totalPartidos = data.reduce((sum, stat) => sum + stat.partidos_jugados, 0);
    const totalAtajadas = data.reduce((sum, stat) => sum + (stat.atajadas || 0), 0);

    setTotales({
      goles: totalGoles,
      asistencias: totalAsistencias,
      partidos_jugados: totalPartidos,
      atajadas: totalAtajadas,
    });
  };

  return (
    <div>
      <h2>Visualizar Estadísticas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {loadingUsuarios ? (
        <p>Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div>
          <label htmlFor="usuario-select">Seleccionar Usuario:</label>
          <select
            id="usuario-select"
            value={usuarioId || ""}
            onChange={(e) => setUsuarioId(e.target.value)}
          >
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} (ID: {usuario.id})
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingEstadisticas ? (
        <p>Cargando estadísticas...</p>
      ) : estadisticas.length === 0 ? (
        <p>No hay estadísticas registradas para este usuario.</p>
      ) : (
        <div>
          <h3>Totales de Estadísticas</h3>
          <ul>
            <li><strong>Goles Totales:</strong> {totales.goles || 0}</li>
            <li><strong>Asistencias Totales:</strong> {totales.asistencias || 0}</li>
            <li><strong>Partidos Jugados Totales:</strong> {totales.partidos_jugados || 0}</li>
            <li><strong>Atajadas Totales:</strong> {totales.atajadas || 0}</li>
          </ul>

          <h3>Historial de Estadísticas</h3>
          <table>
            <thead>
              <tr>
                <th>Goles</th>
                <th>Asistencias</th>
                <th>Partidos Jugados</th>
                <th>Atajadas</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((estadistica) => (
                <tr key={estadistica.id}>
                  <td>{estadistica.goles}</td>
                  <td>{estadistica.asistencias}</td>
                  <td>{estadistica.partidos_jugados}</td>
                  <td>{estadistica.atajadas || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisualizarEstadisticas;