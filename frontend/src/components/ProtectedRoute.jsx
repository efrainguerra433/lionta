import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (!isLoggedIn || user?.rol !== role) {
    return <Navigate to="/login" />; // Redirige al login si no está autenticado o no tiene el rol adecuado
  }

  return children;
};

export default ProtectedRoute;