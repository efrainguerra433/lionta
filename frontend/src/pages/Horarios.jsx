import React, { useState } from 'react';
import './Horarios.css';

function Horarios() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  
  // Datos de horarios extraídos del PDF
  const horarios = [
    // Categorías mayores
    { categoria: '2005-2006', dias: 'Lunes y Viernes', cancha: 'Olaya Herrera', diasExtra: 'Martes', canchaExtra: 'Santa Lucia', hora: '6-8 pm', precio: '$ 115,000', inscripcion: '$ 250,000', renovacion: '$ 230,000' },
    { categoria: '2007-2008', dias: 'Lunes y Viernes', cancha: 'Olaya Herrera', diasExtra: 'Martes', canchaExtra: 'Santa Lucia', hora: '6-8 pm', precio: '$ 115,000', inscripcion: '$ 250,000', renovacion: '$ 230,000' },
    { categoria: '2009', dias: 'Lunes y Viernes', cancha: 'Olaya Herrera', diasExtra: 'Martes', canchaExtra: 'Santa Lucia', hora: '6-8 pm', precio: '$ 115,000', inscripcion: '$ 250,000', renovacion: '$ 230,000' },
    { categoria: '2010', dias: 'Lunes y Viernes', cancha: 'Olaya Herrera', diasExtra: 'Miércoles', canchaExtra: 'Bosque de San Carlos', hora: '6-8 pm', precio: '$ 115,000', inscripcion: '$ 250,000', renovacion: '$ 230,000' },
    { categoria: '2011', dias: 'Lunes y Viernes', cancha: 'Olaya Herrera', diasExtra: 'Miércoles', canchaExtra: 'Bosque de San Carlos', hora: '6-8 pm', precio: '$ 115,000', inscripcion: '$ 250,000', renovacion: '$ 230,000' },
    { categoria: '2012-2013', dias: 'Lunes y Viernes', cancha: 'Olaya Herrera', diasExtra: 'Miércoles', canchaExtra: 'Bosque de San Carlos', hora: '6-8 pm', precio: '$ 115,000', inscripcion: '$ 225,000', renovacion: '$ 215,000' },
    
    // Categorías menores
    { categoria: '2014-2015', dias: 'Martes', cancha: 'Gym Lionta', diasExtra: 'Miércoles', canchaExtra: 'San Jose', hora: '6-8 pm', precio: '$ 105,000', inscripcion: '$ 225,000', renovacion: '$ 215,000' },
    { categoria: '2016', dias: 'Lunes y Jueves', cancha: 'Gustavo Restrepo', diasExtra: 'Sábados', canchaExtra: 'Gustavo Restrepo', hora: '4-6 pm', precio: '$ 105,000', inscripcion: '$ 225,000', renovacion: '$ 215,000' },
    { categoria: '2017-2018', dias: 'Martes y Miércoles', cancha: 'Gustavo Restrepo', diasExtra: 'Sábados', canchaExtra: 'Gustavo Restrepo', hora: '4-6 pm', precio: '$ 95,000', inscripcion: '$ 225,000', renovacion: '$ 215,000' },
    { categoria: '2019-2021', dias: 'Miércoles y Viernes', cancha: 'Gustavo Restrepo', diasExtra: '', canchaExtra: '', hora: '4-5:30 pm', precio: '$ 85,000', inscripcion: '$ 100,000', renovacion: '$ 80,000' },
    
    // Especiales
    { categoria: 'Arqueros Mayores', dias: 'Lunes', cancha: 'Olaya Herrera', diasExtra: '', canchaExtra: '', hora: '6-8 pm', precio: '$ 15,000', inscripcion: '$ 225,000', renovacion: '$ 185,000' },
    { categoria: 'Arqueros Menores', dias: 'Miércoles', cancha: 'Bosque de San Carlos', diasExtra: '', canchaExtra: '', hora: '6-8 pm', precio: '$ 15,000', inscripcion: '$ 225,000', renovacion: '$ 185,000' },
    { categoria: 'Femenina', dias: 'Martes', cancha: 'Gym Lionta', diasExtra: 'Miércoles', canchaExtra: 'Bosque de San Carlos', hora: '6-8 pm', precio: '$ 90,000', inscripcion: '$ 250,000', renovacion: '$ 230,000' },
  ];

  // Filtrar por categoría seleccionada
  const horariosFiltrados = categoriaSeleccionada === 'todas' 
    ? horarios 
    : horarios.filter(h => {
        if (categoriaSeleccionada === 'mayores') return parseInt(h.categoria) < 2014 || h.categoria === 'Arqueros Mayores';
        if (categoriaSeleccionada === 'menores') return parseInt(h.categoria) >= 2014 || h.categoria === 'Arqueros Menores';
        if (categoriaSeleccionada === 'especiales') return h.categoria.includes('Arqueros') || h.categoria === 'Femenina';
        return false;
      });

  return (
    <div className="horarios-container">
      <div className="horarios-header">
        <h1>Horarios de Entrenamiento</h1>
        <p>Conoce los horarios de entrenamiento para cada categoría en Lionta F.C.</p>
      </div>

      <div className="horarios-filtros">
        <button 
          className={categoriaSeleccionada === 'todas' ? 'filtro-activo' : ''} 
          onClick={() => setCategoriaSeleccionada('todas')}
        >
          Todas las categorías
        </button>
        <button 
          className={categoriaSeleccionada === 'mayores' ? 'filtro-activo' : ''} 
          onClick={() => setCategoriaSeleccionada('mayores')}
        >
          Categorías Mayores
        </button>
        <button 
          className={categoriaSeleccionada === 'menores' ? 'filtro-activo' : ''} 
          onClick={() => setCategoriaSeleccionada('menores')}
        >
          Categorías Menores
        </button>
        <button 
          className={categoriaSeleccionada === 'especiales' ? 'filtro-activo' : ''} 
          onClick={() => setCategoriaSeleccionada('especiales')}
        >
          Grupos Especiales
        </button>
      </div>

      <div className="horarios-info">
        <div className="horarios-card info-card">
          <h3>Información de Inscripción</h3>
          <p>La inscripción incluye:</p>
          <ul>
            <li>Uniforme de entrenamiento 2025</li>
            <li>Uniforme de competencia 2025</li>
            <li>Camiseta extra</li>
            <li>Póliza de seguro</li>
            <li>Documentación y papeleo</li>
          </ul>
          <div className="special-note">
            <p>¡PRECIOS ESPECIALES SÓLO EN ENERO!</p>
          </div>
        </div>

        <div className="horarios-card competicion-card">
          <h3>Torneos y Competencias</h3>
          <div className="torneos-container">
            <div className="torneo">
              <div className="torneo-icon">🏆</div>
              <h4>Liga de Bogotá</h4>
              <p>Competencia oficial de fútbol</p>
            </div>
            <div className="torneo">
              <div className="torneo-icon">🏆</div>
              <h4>Torneo Maracaná</h4>
              <p>Torneo de alto nivel formativo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="horarios-tabla-container">
        <h2>Horarios por Categoría</h2>
        <div className="table-responsive">
          <table className="horarios-tabla">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Días Principales</th>
                <th>Cancha</th>
                <th>Días Adicionales</th>
                <th>Cancha</th>
                <th>Horario</th>
                <th>Mensualidad</th>
                <th>Inscripción</th>
                <th>Renovación</th>
              </tr>
            </thead>
            <tbody>
              {horariosFiltrados.map((horario, index) => (
                <tr key={index}>
                  <td><strong>{horario.categoria}</strong></td>
                  <td>{horario.dias}</td>
                  <td>{horario.cancha}</td>
                  <td>{horario.diasExtra || '—'}</td>
                  <td>{horario.canchaExtra || '—'}</td>
                  <td>{horario.hora}</td>
                  <td>{horario.precio}</td>
                  <td>{horario.inscripcion}</td>
                  <td>{horario.renovacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="instalaciones-section">
        <h2>Nuestras Instalaciones</h2>
        <div className="instalaciones-grid">
          <div className="instalacion-card">
            <div className="instalacion-img olaya"></div>
            <h3>Olaya Herrera</h3>
            <p>Sede principal para categorías mayores</p>
          </div>
          <div className="instalacion-card">
            <div className="instalacion-img gustavo"></div>
            <h3>Gustavo Restrepo</h3>
            <p>Sede para categorías menores</p>
          </div>
          <div className="instalacion-card">
            <div className="instalacion-img bosque"></div>
            <h3>Bosque de San Carlos</h3>
            <p>Instalaciones complementarias</p>
          </div>
          <div className="instalacion-card">
            <div className="instalacion-img gym"></div>
            <h3>Gym Lionta</h3>
            <p>Centro de acondicionamiento físico</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Horarios;