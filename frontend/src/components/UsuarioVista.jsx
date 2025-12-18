import React, { useEffect, useState } from "react";

const UsuarioVista = ({ usuarioId }) => {
  const [usuario, setUsuario] = useState(null);
  const [metrica, setMetrica] = useState(null); // Métrica del jugador autenticado
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        console.log("Obteniendo datos del usuario...");
        const usuarioResponse = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}`);
        if (usuarioResponse.ok) {
          const usuarioData = await usuarioResponse.json();
          console.log("Datos del usuario:", usuarioData);
          setUsuario(usuarioData);
        } else {
          setError("Error al obtener los datos del usuario");
          return;
        }

        console.log("Obteniendo métricas del usuario...");
        const metricasResponse = await fetch("http://127.0.0.1:5000/metricas");
        if (metricasResponse.ok) {
          const metricasData = await metricasResponse.json();
          console.log("Métricas obtenidas:", metricasData);

          // Filtrar la métrica correspondiente al usuario autenticado
          const metricaUsuario = metricasData.find(
            (metrica) => metrica.usuario_id === usuarioId
          );
          setMetrica(metricaUsuario);
        } else {
          setError("Error al obtener las métricas del usuario");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [usuarioId]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!usuario) {
    return <p>No se encontraron datos del usuario.</p>;
  }

  return (
    <div>
      <h2>Bienvenido, {usuario.nombre}</h2>
      <div>
        <h3>Métricas del Jugador</h3>
        {metrica ? (
          <ul>
            <li><strong>Posición:</strong> {metrica.posicion}</li>
            <li><strong>Edad:</strong> {metrica.edad}</li>
            <li><strong>Altura:</strong> {metrica.altura}</li>
            <li><strong>Peso:</strong> {metrica.peso}</li>
            <li><strong>Velocidad:</strong> {metrica.velocidad}</li>
            <li><strong>Aceleración:</strong> {metrica.aceleracion}</li>
          </ul>
        ) : (
          <p>No hay métricas registradas para este usuario.</p>
        )}
      </div>
    </div>
  );
};

export default UsuarioVista;