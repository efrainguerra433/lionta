import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PerfilJugador = () => {
  const { usuarioId } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/usuario/${usuarioId}`);
        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
        } else {
          setError("Error al obtener los datos del usuario");
        }
      } catch {
        setError("Error al conectar con el servidor");
      }
    };

    fetchUsuario();
  }, [usuarioId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!usuario) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <div>
      <h2>Perfil Completo del Jugador: {usuario.nombre}</h2>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Documento:</strong> {usuario.documento}</p>
      <p><strong>Categoría:</strong> {usuario.categoria}</p>
      <p><strong>Estado:</strong> {usuario.estado}</p>
      {/* Agrega más detalles si es necesario */}
    </div>
  );
};

export default PerfilJugador;