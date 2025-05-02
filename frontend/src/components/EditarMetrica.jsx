import React, { useState, useEffect } from "react";

const EditarMetrica = ({ usuarioId, onClose, onMetricaActualizada }) => {
  const [metrica, setMetrica] = useState({
    posicion: "",
    edad: "",
    altura: "",
    peso: "",
    velocidad: "",
    aceleracion: "",
  });
  const [error, setError] = useState("");

  // Obtener la métrica actual del usuario
  useEffect(() => {
    const fetchMetrica = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}/metricas`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setMetrica(data[0]); // Carga la primera métrica encontrada
          } else {
            setError("No se encontraron métricas para este usuario.");
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Error al obtener la métrica.");
        }
      } catch (error) {
        setError("Error al conectar con el servidor.");
      }
    };

    fetchMetrica();
  }, [usuarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetrica({ ...metrica, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}/metrica`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metrica),
      });

      if (response.ok) {
        alert("Métrica actualizada correctamente");
        if (onMetricaActualizada) onMetricaActualizada();
        onClose(); // Cierra el formulario
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al actualizar la métrica.");
      }
    } catch (error) {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <h2>Editar Métrica</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Posición:</label>
          <input
            type="text"
            name="posicion"
            value={metrica.posicion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Edad:</label>
          <input
            type="number"
            name="edad"
            value={metrica.edad}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Altura (cm):</label>
          <input
            type="number"
            name="altura"
            value={metrica.altura}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Peso (kg):</label>
          <input
            type="number"
            name="peso"
            value={metrica.peso}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Velocidad (km/h):</label>
          <input
            type="number"
            name="velocidad"
            value={metrica.velocidad}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Aceleración (m/s²):</label>
          <input
            type="number"
            name="aceleracion"
            value={metrica.aceleracion}
            onChange={handleChange}
            required
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

export default EditarMetrica;