import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import RegistroUsuario from "./components/RegistroUsuario";
import Login from "./pages/Login";
import ListaUsuarios from "./pages/ListaUsuarios";
import VerificarCuenta from "./pages/VerificarCuenta";
import './App.css';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MetricasUsuario from "./pages/MetricasUsuario";
import ListaMetricas from "./pages/ListaMetricas";
import OlvidasteContrasena from "./pages/OlvidasteContrasena";
import CambiarContrasena from "./pages/CambiarContrasena";
import RegistrarEstadistica from "./pages/RegistrarEstadistica";
import RegistrarMetrica from "./pages/RegistrarMetrica";
import VisualizarEstadisticas from "./pages/VisualizarEstadisticas";
import MetricasJugador from "./pages/MetricasJugador"; 
import HomePage from "./pages/HomePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Componente separado para poder usar hooks como useContext y useNavigate
function AppContent() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar si estamos en la página principal para mostrar un diseño diferente
  const isHomePage = location.pathname === "/";
  
  // Si estamos en la página de inicio, mostramos el diseño especial de HomePage
  if (isHomePage) {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    );
  }

  // Para las demás rutas, mostramos la estructura de navegación normal
  return (
    <div className="App">
      <header className="main-header">
        <div className="logo">Lionta F.C.</div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/programas">Programas</Link></li>
            <li><Link to="/horarios">Horarios</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            {user ? (
              <>
                <li className="user-menu">
                  <span>{user.nombre || user.email}</span>
                  <div className="dropdown-content">
                    {user?.rol === "admin" && (
                      <>
                        <Link to="/registro">Crear usuario</Link>
                        <Link to="/usuarios">Lista de Usuarios</Link>
                        <Link to="/metricas">Ver Métricas</Link>
                        <Link to="/ver-estadisticas">Ver Estadísticas</Link>
                      </>
                    )}
                    {user?.rol === "jugador" && (
                      <>
                        <Link to="/mis-metricas">Mis Métricas</Link>
                      </>
                    )}
                    <button onClick={logout} className="logout-btn">Cerrar sesión</button>
                  </div>
                </li>
              </>
            ) : (
              <li><Link to="/" className="login-btn">Iniciar sesión</Link></li>
            )}
          </ul>
        </nav>
      </header>

      <main className="content-container">
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
          <Route path="/login" element={
            user ? (
              <Navigate to={user.rol === 'admin' ? '/usuarios' : '/mis-metricas'} replace />
            ) : (
              <Login />
            )
          } />
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
          {/* Rutas adicionales para las nuevas secciones */}
          <Route path="/programas" element={<div className="page-content"><h1>Programas</h1><p>Información sobre nuestros programas de entrenamiento.</p></div>} />
          <Route path="/horarios" element={<div className="page-content"><h1>Horarios</h1><p>Horarios de entrenamiento y partidos.</p></div>} />
          <Route path="/contacto" element={<div className="page-content"><h1>Contacto</h1><p>Información de contacto del club.</p></div>} />
        </Routes>
      </main>
      
      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} Lionta F.C. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;