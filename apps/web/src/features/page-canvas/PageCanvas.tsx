/**
 * PAGE CANVAS - Contenedor principal de páginas
 * 
 * Este componente actúa como el contenedor principal para las diferentes
 * "páginas" de la aplicación. En un SPA, las páginas son componentes.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Single Page Application (SPA): Una sola página HTML, múltiples vistas
 * - Page Components: Componentes que representan páginas completas
 * - State Management: Manejo del estado de navegación entre páginas
 */

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

// Importar el hook del contexto de sesión de estudio
import { useStudySession } from '../../contexts/StudySessionContext';

// No necesitamos estos iconos ya que ahora están en StudySessionConfig
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Importar páginas y componentes
import Homepage from '../homepage/Homepage';
import StudySession from '../study-session/components/StudySession';
import StudySessionConfig from '../study-session/components/StudySessionConfig';

// Importar tipos
import type { DrillType, SessionDuration } from '../study-session/types';
import type { LatinWord } from '../../components/global/WordCard';

/**
 * TIPOS DE PÁGINA DISPONIBLES
 */
type PageType = 'homepage' | 'study-config' | 'study-session';

/**
 * PAGE CANVAS - CONTENEDOR PRINCIPAL
 * 
 * Maneja la navegación entre diferentes páginas/vistas de la aplicación
 */
const PageCanvas: React.FC = () => {
  // Estado de la página actual
  const [currentPage, setCurrentPage] = useState<PageType>('homepage');
  
  // Estados para la configuración de la sesión de estudio
  // Estos estados se comparten entre las páginas de configuración y sesión
  const [selectedWords, setSelectedWords] = useState<LatinWord[]>([]);
  const [duration, setDuration] = useState<SessionDuration>(10);
  const [drillTypes, setDrillTypes] = useState<DrillType[]>(['multipleChoice']);
  
  // Hook para manejar el contexto de sesión de estudio
  const { enterStudySession, exitStudySession } = useStudySession();
  
  /**
   * EFECTO PARA MANEJAR EL ESTADO DE SESIÓN
   * 
   * Este useEffect se ejecuta cada vez que cambia currentPage.
   * Activa o desactiva el modo de sesión de estudio según la página actual.
   * 
   * CONCEPTO: useEffect
   * - Se ejecuta después de cada renderizado
   * - El segundo parámetro [currentPage] hace que solo se ejecute cuando cambia currentPage
   * - La función de retorno se ejecuta al limpiar (cuando el componente se desmonta o antes del próximo efecto)
   */
  useEffect(() => {
    // Si entramos a configuración o sesión de estudio, activar modo sesión
    if (currentPage === 'study-config' || currentPage === 'study-session') {
      enterStudySession();
    } 
    // Si volvemos a homepage, desactivar modo sesión
    else if (currentPage === 'homepage') {
      exitStudySession();
    }
    
    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => {
      // Asegurar que salimos del modo sesión si el componente se desmonta
      exitStudySession();
    };
  }, [currentPage, enterStudySession, exitStudySession]);
  
  /**
   * MANEJADOR PARA IR A CONFIGURACIÓN DE SESIÓN
   * Llamado desde la Homepage cuando el usuario quiere empezar
   */
  const handleStartConfiguration = () => {
    setCurrentPage('study-config');
  };
  
  /**
   * MANEJADOR PARA INICIAR SESIÓN
   * Llamado desde el último paso de configuración
   */
  const handleStartSession = () => {
    setCurrentPage('study-session');
  };
  
  /**
   * MANEJADOR PARA FINALIZAR SESIÓN
   * Vuelve a la homepage al terminar
   */
  const handleEndSession = () => {
    setCurrentPage('homepage');
    // Opcionalmente, limpiar las selecciones
    // setSelectedWords([]);
    // setDuration(10);
    // setDrillTypes(['multipleChoice']);
  };

  /**
   * RENDERIZAR PÁGINA SEGÚN EL ESTADO ACTUAL
   */

  // PÁGINA 1: HOMEPAGE
  if (currentPage === 'homepage') {
    return (
      <Box 
        data-testid="homepage-wrapper"
        sx={{ 
          minHeight: 'calc(100vh - 110px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Homepage onStartSession={handleStartConfiguration} />
      </Box>
    );
  }
  
  // SESIÓN DE ESTUDIO ACTIVA
  // StudySession es una página completa que maneja su propio layout
  if (currentPage === 'study-session') {
    return (
      <StudySession
        selectedWords={selectedWords}
        duration={duration}
        drillTypes={drillTypes}
        onEndSession={handleEndSession}
      />
    );
  }
  
  // CONFIGURACIÓN DE SESIÓN DE ESTUDIO
  // StudySessionConfig es una página completa que maneja su propio layout
  if (currentPage === 'study-config') {
    return (
      <StudySessionConfig
        selectedWords={selectedWords}
        onSelectionChange={setSelectedWords}
        duration={duration}
        onDurationChange={setDuration}
        drillTypes={drillTypes}
        onDrillTypesChange={setDrillTypes}
        onStartSession={handleStartSession}
      />
    );
  }
  
  // Si llegamos aquí, mostramos la homepage por defecto
  return (
    <Box 
      data-testid="homepage-wrapper"
      sx={{ 
        minHeight: 'calc(100vh - 110px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Homepage onStartSession={handleStartConfiguration} />
    </Box>
  );
};


// Exportar el componente
export default PageCanvas;