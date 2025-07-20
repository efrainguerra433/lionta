import React, { useState, useEffect } from "react";
import EditarMetrica from "../components/EditarMetrica";

const ListaMetricas = () => {
  const [metricas, setMetricas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Función para obtener las últimas métricas de cada jugador
  const fetchMetricas = async () => {
    try {
      setLoading(true);
      // Usa el endpoint /metricas/recientes que ya tienes implementado
      const response = await fetch("http://127.0.0.1:5000/metricas/recientes");
      if (response.ok) {
        const data = await response.json();
        setMetricas(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al obtener las métricas");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Llamar a fetchMetricas cuando el componente se monte
  useEffect(() => {
    fetchMetricas();
  }, []);

  if (loading) return <p>Cargando métricas...</p>;

  return (
    <div>
      <h1>Última Métrica Registrada</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {usuarioSeleccionado && (
        <EditarMetrica
          usuarioId={usuarioSeleccionado}
          onClose={() => setUsuarioSeleccionado(null)}
          onMetricaActualizada={fetchMetricas} // Llama a fetchMetricas después de actualizar
        />
      )}
      {metricas.length === 0 ? (
        <p>No hay métricas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Usuario ID</th>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Edad</th>
              <th>Altura</th>
              <th>Peso</th>
              <th>Velocidad</th>
              <th>Aceleración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {metricas.map((metrica, index) => (
              <tr key={index}>
                <td>{metrica.usuario_id}</td>
                <td>{metrica.usuario_nombre}</td>
                <td>{metrica.posicion}</td>
                <td>{metrica.edad}</td>
                <td>{metrica.altura}</td>
                <td>{metrica.peso}</td>
                <td>{metrica.velocidad}</td>
                <td>{metrica.aceleracion}</td>
                <td>
                  <button onClick={() => setUsuarioSeleccionado(metrica.usuario_id)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaMetricas;