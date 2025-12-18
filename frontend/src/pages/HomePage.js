import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './HomePage.css';

function HomePage() {
  const { login, user, isLoading, loginError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  
  // Efecto para redireccionar si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      // Si el usuario ya está logueado, redirigir según su rol
      if (user.rol === 'admin') {
        navigate('/usuarios');
      } else if (user.rol === 'jugador') {
        navigate('/mis-metricas');
      }
    }
  }, [user, navigate]);

  // Efecto para manejar errores de login desde el contexto
  useEffect(() => {
    if (loginError) {
      setError(loginError);
    }
  }, [loginError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password, rememberMe);
      // El redireccionamiento se maneja en el primer useEffect cuando cambia "user"
    } catch (err) {
      console.error("Error en login:", err);
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo">Lionta F.C.</div>
        <nav className="main-nav">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#programas">Programas</a></li>
            <li><a href="#horarios">Horarios</a></li>
            <li><a href="#contacto">Contacto</a></li>
            {user?.rol === 'admin' && (
              <li><Link to="/usuarios" style={{color: 'var(--accent-color)'}}>Panel Admin</Link></li>
            )}
            {user?.rol === 'jugador' && (
              <li><Link to="/mis-metricas" style={{color: 'var(--accent-color)'}}>Mis Métricas</Link></li>
            )}
          </ul>
        </nav>
      </header>
      
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Forma parte de nuestra familia futbolística</h1>
            <p>Desarrolla tu talento con los mejores entrenadores y metodología de primera clase.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => user ? navigate('/mis-metricas') : navigate('/login')}>
                {user ? 'Mi Dashboard' : 'Comenzar ahora'}
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/programas')}>Saber más</button>
            </div>
          </div>
          
          {/* Mostramos el formulario de login solo si el usuario no está autenticado */}
          {!user && (
            <div className="login-card">
              <div className="login-form-container">
                <h2>Accede a tu cuenta</h2>
                {error && <div className="error-message">{error}</div>}
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-options">
                    <div className="remember-me">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember">Recordarme</label>
                    </div>
                    <Link to="/recuperar-contrasena" className="forgot-password">
                      ¿Olvidaste?
                    </Link>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-login"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {/* Si el usuario está autenticado, mostramos un mensaje o panel */}
          {user && (
            <div className="welcome-panel">
              <h2>¡Bienvenido, {user.nombre || user.email}!</h2>
              <p>Accede a tu panel personalizado para ver tus datos y actividades.</p>
              {user.rol === 'admin' ? (
                <div className="admin-quick-links">
                  <Link to="/usuarios" className="btn btn-primary">Lista de Usuarios</Link>
                  <Link to="/registro" className="btn btn-outline">Crear Usuario</Link>
                  <Link to="/metricas" className="btn btn-outline">Ver Métricas</Link>
                  <Link to="/ver-estadisticas" className="btn btn-outline">Ver Estadísticas</Link>
                </div>
              ) : user.rol === 'jugador' ? (
                <Link to="/mis-metricas" className="btn btn-primary">Ver mis métricas</Link>
              ) : (
                <Link to="/" className="btn btn-primary">Dashboard</Link>
              )}
            </div>
          )}
        </div>
        
        <div className="hero-features">
          <div className="hero-feature">
            <h3>Entrenadores Profesionales</h3>
            <p>Nuestro equipo de entrenadores certificados asegura un desarrollo técnico y táctico óptimo.</p>
          </div>
          
          <div className="hero-feature">
            <h3>Instalaciones de Primera</h3>
            <p>Contamos con campos de entrenamiento de alta calidad y equipamiento moderno.</p>
          </div>
          
          <div className="hero-feature">
            <h3>Metodología Única</h3>
            <p>Nuestro programa formativo integral combina aspectos técnicos, físicos y valores deportivos.</p>
          </div>
        </div>
      </main>
      
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Lionta F.C. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;