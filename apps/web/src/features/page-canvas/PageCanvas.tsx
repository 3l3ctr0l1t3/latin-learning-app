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

import React, { useState } from 'react';
import {
  Box,
  Button
} from '@mui/material';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Importar páginas y componentes
import Homepage from '../homepage/Homepage';
import ConfigStep1WordSelection from '../study-session/components/ConfigStep1WordSelection';
import ConfigStep2DurationDrills from '../study-session/components/ConfigStep2DurationDrills';
import StudySession from '../study-session/components/StudySession';

// Importar tipos
import type { DrillType, SessionDuration } from '../study-session/types';
import type { LatinWord } from '../study-session/components/WordCard';

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
  const [selectedWords, setSelectedWords] = useState<LatinWord[]>([]);
  const [duration, setDuration] = useState<SessionDuration>(10);
  const [drillTypes, setDrillTypes] = useState<DrillType[]>(['multipleChoice']);
  const [currentStep, setCurrentStep] = useState(0); // Para navegación por pasos en configuración

  // Pasos de configuración
  const steps = [
    'Seleccionar Palabras',
    'Duración y Ejercicios'
  ];

  /**
   * MANEJADOR PARA AVANZAR AL SIGUIENTE PASO
   */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * MANEJADOR PARA RETROCEDER AL PASO ANTERIOR
   */
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * VALIDACIÓN: ¿Puede avanzar al siguiente paso?
   */
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedWords.length >= 5; // Mínimo 5 palabras
      case 1:
        return drillTypes.length > 0; // Al menos un tipo de ejercicio
      default:
        return true;
    }
  };
  
  /**
   * MANEJADOR PARA IR A CONFIGURACIÓN DE SESIÓN
   * Llamado desde la Homepage cuando el usuario quiere empezar
   */
  const handleStartConfiguration = () => {
    setCurrentPage('study-config');
    setCurrentStep(0); // Empezar desde el primer paso
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
    setCurrentStep(0); // Resetear pasos de configuración
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
  
  // PÁGINA 2: SESIÓN DE ESTUDIO ACTIVA
  if (currentPage === 'study-session') {
    return (
      <Box
        data-testid="study-session-page-wrapper"
        sx={{
          // Centrar el contenido en pantallas grandes
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 110px)',
          px: { xs: 0, md: 2, lg: 3, xl: 4 }, // Padding horizontal en pantallas grandes
          py: { xs: 0, md: 2 }, // Padding vertical en pantallas grandes
        }}
      >
        <Box 
          data-testid="study-session-wrapper"
          sx={{ 
            // Limitar el ancho máximo en pantallas grandes
            width: '100%',
            maxWidth: {
              xs: '100%',      // Móvil: ancho completo
              sm: '100%',      // Tablet pequeña: ancho completo
              md: '900px',     // Desktop mediano: máximo 900px
              lg: '1100px',    // Desktop grande: máximo 1100px
              xl: '1300px'     // Desktop XL: máximo 1300px
            },
            // Ajustar alturas para que quepa sin scroll
            height: { 
              xs: 'calc(100vh - 110px)',  // Móvil: altura completa
              sm: '600px',     // Tablet: 600px
              md: '650px',     // Desktop mediano: 650px (reducido de 750px)
              lg: '700px',     // Desktop grande: 700px (reducido de 850px)
              xl: '750px'      // Desktop XL: 750px (reducido de 950px)
            },
            display: 'flex',
            flexDirection: 'column',
            // Agregar sombra y borde en pantallas grandes
            boxShadow: { xs: 0, md: 3, lg: 4 },
            borderRadius: { xs: 0, md: 2 },
            bgcolor: { xs: 'transparent', md: 'background.paper' },
            // Padding interno
            p: {
              xs: 0.5,         // Móvil: padding mínimo
              sm: 1,           // Tablet: padding pequeño
              md: 2,           // Desktop: padding normal
              lg: 2.5,         // Desktop grande: más padding
              xl: 3            // Desktop XL: padding amplio
            }
          }}
        >
          <StudySession
            selectedWords={selectedWords}
            duration={duration}
            drillTypes={drillTypes}
            onEndSession={handleEndSession}
          />
        </Box>
      </Box>
    );
  }
  
  // PÁGINA 3: CONFIGURACIÓN DE SESIÓN DE ESTUDIO

  return (
    <Box
      data-testid="config-page-wrapper"
      sx={{
        // Mismo enfoque que la sesión de estudio: centrado y contenido
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 110px)',
        px: { xs: 0, md: 2, lg: 3, xl: 4 }, // Padding horizontal en pantallas grandes
        py: { xs: 0, md: 2 }, // Padding vertical en pantallas grandes
      }}
    >
      <Box 
        data-testid="study-session-config-page"
        sx={{ 
          // Limitar el ancho máximo como en la sesión
          width: '100%',
          maxWidth: {
            xs: '100%',      // Móvil: ancho completo
            sm: '100%',      // Tablet pequeña: ancho completo
            md: '900px',     // Desktop mediano: máximo 900px
            lg: '1100px',    // Desktop grande: máximo 1100px
            xl: '1300px'     // Desktop XL: máximo 1300px
          },
          // Alturas ajustadas para evitar scroll
          height: { 
            xs: 'calc(100vh - 110px)',  // Móvil: altura completa
            sm: '600px',     // Tablet: 600px
            md: '650px',     // Desktop mediano: 650px
            lg: '700px',     // Desktop grande: 700px
            xl: '750px'      // Desktop XL: 750px
          },
          display: 'flex',
          flexDirection: 'column',
          // Estilo visual consistente con la sesión
          boxShadow: { xs: 0, md: 3, lg: 4 },
          borderRadius: { xs: 0, md: 2 },
          bgcolor: { xs: 'transparent', md: 'background.paper' },
          // Padding interno
          p: {
            xs: 0.5,         // Móvil: padding mínimo
            sm: 1,           // Tablet: padding pequeño
            md: 2,           // Desktop: padding normal
            lg: 2.5,         // Desktop grande: más padding
            xl: 3            // Desktop XL: padding amplio
          }
        }}>
      {/* CONTENIDO DE CADA PASO */}
      <Box 
        data-testid="step-content-container"
        sx={{ 
          flexGrow: 1,  // Toma todo el espacio disponible
          minHeight: '250px',
          // Solo mostrar scroll en el paso 1 (selección de palabras) que puede tener mucho contenido
          // En el paso 2 (duración y ejercicios) no hay necesidad de scroll
          overflowY: currentStep === 0 ? 'auto' : 'hidden',  // 'hidden' evita scroll en paso 2
          overflowX: 'hidden'  // Evitar scroll horizontal siempre
        }}>
        {/* PASO 1: SELECCIONAR PALABRAS - Usando el nuevo componente optimizado */}
        {currentStep === 0 && (
          <ConfigStep1WordSelection
            selectedWords={selectedWords}
            onSelectionChange={setSelectedWords}
            minWords={5}
            maxWords={30}
          />
        )}

        {/* PASO 2: DURACIÓN Y EJERCICIOS - Con botón de inicio integrado */}
        {currentStep === 1 && (
          <ConfigStep2DurationDrills
            duration={duration}
            onDurationChange={setDuration}
            drillTypes={drillTypes}
            onDrillTypesChange={setDrillTypes}
            onStartSession={handleStartSession}
            canStartSession={selectedWords.length >= 5}
          />
        )}
      </Box>

      {/* NAVEGACIÓN ENTRE PASOS */}
      {(
        <Box 
          data-testid="navigation-buttons-container"
          sx={{ 
          mt: { xs: 2, sm: 3 },  // Menos margen en móvil
          pt: { xs: 1.5, sm: 2 },  // Menos padding en móvil
          pb: { xs: 0, sm: 0, l:0, xl:0, m:0 },  // Padding inferior solo en móvil
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex', 
          justifyContent: 'space-between',
          gap: 2  // Espacio entre botones
        }}>
        <Button
          data-testid="nav-button-back"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          disabled={currentStep === 0}
          sx={{ 
            fontSize: { xs: '1rem', sm: '0.875rem' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Anterior
        </Button>
        
        <Button
          data-testid="nav-button-next"
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          onClick={() => {
            // En el paso 1, "Comenzar" inicia la sesión
            if (currentStep === 1) {
              handleStartSession();
            } else {
              handleNext();
            }
          }}
          disabled={!canProceed()}
          sx={{ 
            fontSize: { xs: '1rem', sm: '0.875rem' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          {/* Mostrar "Comenzar" en el paso 2, "Siguiente" en otros pasos */}
          {currentStep === 1 ? 'Comenzar' : 'Siguiente'}
        </Button>
      </Box>
      )}
      </Box>
    </Box>
  );
};


// Exportar el componente
export default PageCanvas;