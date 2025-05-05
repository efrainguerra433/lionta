import React, { useEffect, useState } from "react";

const MetricasJugador = () => {
  const [metricas, setMetricas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetricas = async () => {
      setLoading(true);
      const token = localStorage.getItem("token"); // Obtén el token del localStorage
      try {
        const response = await fetch("http://127.0.0.1:5000/metricas/jugador", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Envía el token en el encabezado
          },
        });
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

    fetchMetricas();
  }, []);

  if (loading) {
    return <p>Cargando métricas...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h3>Métricas del Jugador</h3>
      {metricas.length === 0 ? (
        <p>No hay métricas registradas para este jugador.</p>
      ) : (
        <ul>
          {metricas.map((metrica) => (
            <li key={metrica.id}>
              <strong>Posición:</strong> {metrica.posicion}, <strong>Edad:</strong> {metrica.edad}, <strong>Altura:</strong> {metrica.altura}, <strong>Peso:</strong> {metrica.peso}, <strong>Velocidad:</strong> {metrica.velocidad}, <strong>Aceleración:</strong> {metrica.aceleracion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MetricasJugador;