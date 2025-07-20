import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RegistrarMetrica from "./RegistrarMetrica";

const MetricasUsuario = () => {
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const usuarioId = parseInt(id, 10); // Convierte el ID a un número

  const [metricas, setMetricas] = useState([]);
  const [error, setError] = useState("");

  // Obtener las métricas del usuario al cargar el componente
  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}/metricas`);
        if (response.ok) {
          const data = await response.json();
          setMetricas(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Error al obtener las métricas");
        }
      } catch (error) {
        setError("Error al conectar con el servidor");
      }
    };

    fetchMetricas();
  }, [usuarioId]);

  // Función para manejar el registro de una nueva métrica
  const handleMetricaRegistrada = () => {
    // Actualiza la lista de métricas después de registrar una nueva
    const fetchMetricas = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}/metricas`);
        if (response.ok) {
          const data = await response.json();
          setMetricas(data);
        }
      } catch (error) {
        console.error("Error al actualizar métricas:", error);
      }
    };

    fetchMetricas();
  };

  return (
    <div>
      <h1>Métricas del Usuario</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Formulario para registrar una nueva métrica */}
      <RegistrarMetrica usuarioId={usuarioId} onMetricaRegistrada={handleMetricaRegistrada} />

      {/* Tabla para mostrar las métricas existentes */}
      <h2>Lista de Métricas</h2>
      {metricas.length === 0 ? (
        <p>No hay métricas registradas para este usuario.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Posición</th>
              <th>Edad</th>
              <th>Altura</th>
              <th>Peso</th>
              <th>Velocidad</th>
              <th>Aceleración</th>
            </tr>
          </thead>
          <tbody>
            {metricas.map((metrica) => (
              <tr key={metrica.id}>
                <td>{metrica.id}</td>
                <td>{metrica.posicion}</td>
                <td>{metrica.edad}</td>
                <td>{metrica.altura}</td>
                <td>{metrica.peso}</td>
                <td>{metrica.velocidad}</td>
                <td>{metrica.aceleracion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MetricasUsuario;