import React, { useState } from "react";

const RegistrarMetrica = ({ usuarioId, onMetricaRegistrada }) => {
  const [metrica, setMetrica] = useState({
    posicion: "",
    edad: "",
    altura: "",
    peso: "",
    velocidad: "",
    aceleracion: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetrica({ ...metrica, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}/registrar_metrica`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metrica),
      });

      if (response.ok) {
        alert("Métrica registrada correctamente");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al registrar la métrica");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <h2>Registrar Métrica</h2>
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
        <button type="submit">Registrar Métrica</button>
      </form>
    </div>
  );
};

export default RegistrarMetrica;