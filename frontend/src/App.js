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
import OlvidasteContrasena from "./components/OlvidasteContrasena";
import CambiarContrasena from "./components/CambiarContrasena";
import RegistrarEstadistica from "./components/RegistrarEstadistica";
import RegistrarMetrica from "./components/RegistrarMetrica";
import VisualizarEstadisticas from "./components/VisualizarEstadisticas"; // Importar el componente
import MetricasJugador from "./components/MetricasJugador"; 

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
              <button onClick={() => navigate("/ver-estadisticas")}>Ver Estadísticas</button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/recuperar-contrasena" element={<OlvidasteContrasena />} />
          <Route path="/restablecer-contrasena/:token" element={<CambiarContrasena />} />
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
          <Route path="/usuario/:id/metricas" element={<MetricasUsuario />} />
          <Route
            path="/metricas"
            element={
              <ProtectedRoute role="admin">
                <ListaMetricas />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<ListaUsuarios />} />
          <Route path="/registrar-estadisticas/:usuarioId" element={<RegistrarEstadistica />} />
          <Route path="/registrar-metricas/:usuarioId" element={<RegistrarMetrica />} />
          <Route
            path="/ver-estadisticas"
            element={
              <ProtectedRoute role="admin">
                <VisualizarEstadisticas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-metricas"
            element={
              <ProtectedRoute role="jugador">
                <MetricasJugador />
              </ProtectedRoute>
            }
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
