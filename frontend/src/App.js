import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import RegistroUsuario from "./components/RegistroUsuario";
import Login from "./components/Login";
import ListaUsuarios from "./components/ListaUsuarios";
import VerificarCuenta from "./components/VerificarCuenta";
import './App.css';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MetricasUsuario from "./components/MetricasUsuario";
import ListaMetricas from "./components/ListaMetricas";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Nuevo componente separado para poder usar hooks como useContext y useNavigate
function AppContent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a Lionta</h1>
        <nav>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/usuarios">
            <button>Lista de Usuarios</button>
          </Link>

          {/* Botón extra solo visible para admin */}
          {user?.rol === "admin" && (
            <>
              <button onClick={() => navigate("/registro")}>Crear usuario</button>
              <button onClick={() => navigate("/metricas")}>Ver Métricas</button>
            </>
          )}
        </nav>

        <Routes>
          <Route 
            path="/registro"
            element={
              <ProtectedRoute role="admin">
                <RegistroUsuario />
              </ProtectedRoute>
            }
          />
          <Route path="/verificar/:token" element={<VerificarCuenta />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute role="admin">
                <ListaUsuarios />
              </ProtectedRoute>
            }
          />
          <Route path="/usuario/:id/metricas" element={<MetricasUsuario usuarioId={1} />} />
          <Route
            path="/metricas"
            element={
              <ProtectedRoute role="admin">
                <ListaMetricas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
