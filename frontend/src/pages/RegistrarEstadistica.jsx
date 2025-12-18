import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RegistrarEstadistica = () => {
  const { usuarioId } = useParams(); // Obtener el ID del usuario desde la URL
  const [goles, setGoles] = useState(0);
  const [asistencias, setAsistencias] = useState(0);
  const [partidosJugados, setPartidosJugados] = useState(0);
  const [atajadas, setAtajadas] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [estadisticas, setEstadisticas] = useState([]); // Historial de estadísticas

  // Obtener el historial de estadísticas del usuario
  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/usuario/${usuarioId}/estadisticas`
        );
        if (response.ok) {
          const data = await response.json();
          setEstadisticas(data); // Guardar el historial de estadísticas
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Error al obtener las estadísticas");
        }
      } catch {
        setError("Error al conectar con el servidor");
      }
    };

    fetchEstadisticas();
  }, [usuarioId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/usuario/${usuarioId}/estadisticas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goles,
            asistencias,
            partidos_jugados: partidosJugados,
            atajadas,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMensaje(data.mensaje);
        setGoles(0);
        setAsistencias(0);
        setPartidosJugados(0);
        setAtajadas(0);

        // Actualizar el historial de estadísticas después de registrar
        const updatedResponse = await fetch(
          `http://127.0.0.1:5000/usuario/${usuarioId}/estadisticas`
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setEstadisticas(updatedData);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al registrar las estadísticas.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <h2>Registrar Estadísticas para Usuario ID: {usuarioId}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Goles:</label>
          <input
            type="number"
            value={goles}
            onChange={(e) => setGoles(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Asistencias:</label>
          <input
            type="number"
            value={asistencias}
            onChange={(e) => setAsistencias(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Partidos Jugados:</label>
          <input
            type="number"
            value={partidosJugados}
            onChange={(e) => setPartidosJugados(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Atajadas:</label>
          <input
            type="number"
            value={atajadas}
            onChange={(e) => setAtajadas(Number(e.target.value))}
          />
        </div>
        <button type="submit">Registrar Estadísticas</button>
      </form>

      <h2>Historial de Estadísticas</h2>
      {estadisticas.length === 0 ? (
        <p>No hay estadísticas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Goles</th>
              <th>Asistencias</th>
              <th>Partidos Jugados</th>
              <th>Atajadas</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((estadistica) => (
              <tr key={estadistica.id}>
                <td>{estadistica.id}</td>
                <td>{estadistica.goles}</td>
                <td>{estadistica.asistencias}</td>
                <td>{estadistica.partidos_jugados}</td>
                <td>{estadistica.atajadas || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegistrarEstadistica;