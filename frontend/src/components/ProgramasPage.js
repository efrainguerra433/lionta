import React from 'react';
import './ProgramasPage.css';

function ProgramasPage() {
  // Datos de los programas basados en el PDF
  const categorias = [
    { nombre: "Categoría 2005-2006", edades: "17-18 años", descripcion: "Entrenamiento avanzado con enfoque en técnica, táctica y competición." },
    { nombre: "Categoría 2007-2008", edades: "15-16 años", descripcion: "Desarrollo de habilidades técnicas y conocimiento táctico del juego." },
    { nombre: "Categoría 2009-2010", edades: "13-14 años", descripcion: "Perfeccionamiento de fundamentos y desarrollo técnico-táctico." },
    { nombre: "Categoría 2011-2012", edades: "11-12 años", descripcion: "Aprendizaje de fundamentos técnicos y primeros conceptos tácticos." },
    { nombre: "Categoría 2013-2014", edades: "9-10 años", descripcion: "Iniciación al fútbol con énfasis en diversión y desarrollo motriz." },
    { nombre: "Categoría 2015-2016", edades: "7-8 años", descripcion: "Desarrollo motor y familiarización con el balón de forma lúdica." },
    { nombre: "Categoría 2017-2021", edades: "3-6 años", descripcion: "Iniciación deportiva y juegos pre-deportivos." },
    { nombre: "Escuela de Arqueros", edades: "Todas las edades", descripcion: "Entrenamiento especializado para porteros con entrenadores específicos." },
    { nombre: "Femenino", edades: "Todas las edades", descripcion: "Entrenamiento especializado para el desarrollo del fútbol femenino." }
  ];

  // Beneficios del programa
  const beneficios = [
    {
      titulo: "Entrenamiento Integral",
      descripcion: "Desarrollamos aspectos técnicos, tácticos, físicos y psicológicos para una formación completa.",
      icono: "🏆"
    },
    {
      titulo: "Competiciones Oficiales",
      descripcion: "Participación en torneos de Liga de Bogotá y Maracaná para poner en práctica lo aprendido.",
      icono: "🏅"
    },
    {
      titulo: "Seguimiento Personalizado",
      descripcion: "Evaluaciones periódicas y registro de métricas para monitorear el progreso de cada jugador.",
      icono: "📊"
    },
    {
      titulo: "Valores Deportivos",
      descripcion: "Fomentamos el trabajo en equipo, respeto, disciplina y compromiso en todos nuestros entrenamientos.",
      icono: "🤝"
    }
  ];

  // Precios
  const precios = {
    mensualidadDesde: "$ 85.000",
    mensualidadHasta: "$ 115.000",
    inscripcionDesde: "$ 100.000",
    inscripcionHasta: "$ 250.000",
  };

  return (
    <div className="programas-page">
      <section className="programas-hero">
        <div className="programas-hero-content">
          <h1>Programas de Formación</h1>
          <p>Desarrollamos talento futbolístico con metodología profesional adaptada a cada edad y nivel</p>
        </div>
      </section>

      <section className="programas-info">
        <div className="programas-container">
          <div className="programas-descripcion">
            <h2>Nuestra Metodología</h2>
            <p>
              En Lionta F.C. trabajamos con una metodología propia que busca desarrollar jugadores 
              técnicamente hábiles, tácticamente inteligentes y con valores sólidos. Nuestro programa 
              se adapta a las diferentes etapas de desarrollo de los jugadores, respetando sus procesos 
              de aprendizaje y maduración física y mental.
            </p>
            <p>
              Contamos con entrenadores certificados y una estructura deportiva profesional que 
              garantiza una experiencia formativa de alta calidad para todos nuestros deportistas.
            </p>
          </div>

          <div className="beneficios-grid">
            {beneficios.map((beneficio, index) => (
              <div className="beneficio-card" key={index}>
                <div className="beneficio-icono">{beneficio.icono}</div>
                <h3>{beneficio.titulo}</h3>
                <p>{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="categorias-section">
        <div className="programas-container">
          <h2>Nuestras Categorías</h2>
          <div className="categorias-grid">
            {categorias.map((categoria, index) => (
              <div className="categoria-card" key={index}>
                <h3>{categoria.nombre}</h3>
                <div className="categoria-edades">{categoria.edades}</div>
                <p>{categoria.descripcion}</p>
                <button className="btn-categoria">Más información</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="precios-section">
        <div className="programas-container">
          <h2>Inversión</h2>
          <div className="precios-cards">
            <div className="precio-card">
              <h3>Mensualidad</h3>
              <div className="precio-rango">
                <span className="precio-desde">{precios.mensualidadDesde}</span>
                <span className="precio-hasta">{precios.mensualidadHasta}</span>
              </div>
              <p>El valor varía según la categoría y horas de entrenamiento</p>
              <ul className="precio-incluye">
                <li>Entrenamiento con personal calificado</li>
                <li>Acceso a instalaciones deportivas</li>
                <li>Seguimiento técnico</li>
              </ul>
            </div>

            <div className="precio-card">
              <h3>Inscripción</h3>
              <div className="precio-rango">
                <span className="precio-desde">{precios.inscripcionDesde}</span>
                <span className="precio-hasta">{precios.inscripcionHasta}</span>
              </div>
              <p>Inversión única anual según categoría</p>
              <ul className="precio-incluye">
                <li>Uniforme de entrenamiento</li>
                <li>Uniforme de competencia</li>
                <li>Camiseta extra</li>
                <li>Póliza de seguro</li>
                <li>Papeleo y registro</li>
              </ul>
            </div>
          </div>
          <div className="precio-nota">
            <p>* Ofrecemos descuentos especiales en enero y para hermanos</p>
            <p>* Consulta descuentos para arqueros y categorías específicas</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="programas-container">
          <h2>¿Listo para ser parte de Lionta F.C.?</h2>
          <p>Agenda una clase de prueba gratuita y conoce nuestra metodología</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Agendar prueba</button>
            <button className="btn btn-outline">Contactar</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProgramasPage;