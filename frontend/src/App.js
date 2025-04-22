import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistroUsuario from "./components/RegistroUsuario";
import Login from "./components/Login";
import ListaUsuarios from "./components/ListaUsuarios"; // Importa el componente
import './App.css';
import { AuthProvider } from "./context/AuthContext"; // Importación correcta
import ProtectedRoute from "./components/ProtectedRoute"; // Importa el componente de protección

function App() {
  return (
    <AuthProvider> {/* Envuelve la aplicación con AuthProvider */}
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Bienvenido a Lionta</h1>
            <nav>
              <Link to="/registro">
                <button>Registro</button>
              </Link>
              <Link to="/login">
                <button>Login</button>
              </Link>
              <Link to="/usuarios">
                <button>Lista de Usuarios</button>
              </Link>
            </nav>
            <Routes>
              <Route path="/registro" element={<RegistroUsuario />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute role="admin">
                    <ListaUsuarios />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </header>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
