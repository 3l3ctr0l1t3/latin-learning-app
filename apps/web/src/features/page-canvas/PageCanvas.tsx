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
  // Container, // Removed - not being used
  Paper,
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

// Importar constantes de espaciado - para usar alturas consistentes
import { HEIGHTS } from '../study-session/constants/spacing';

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
        data-testid="study-session-wrapper"
        sx={{ 
          // Usar alturas desde constantes - ahora más grandes para pantallas md/lg/xl
          minHeight: { 
            xs: 'calc(100vh - 110px)',  // Móvil: ajustado para llenar toda la pantalla
            sm: `${HEIGHTS.studyContainer.sm}px`,  // Tablet: 650px
            md: `${HEIGHTS.studyContainer.md}px`,  // Desktop mediano: 750px (aumentado)
            lg: `${HEIGHTS.studyContainer.lg}px`,  // Desktop grande: 850px (aumentado)
            xl: `${HEIGHTS.studyContainer.xl}px`   // Desktop XL: 950px (aumentado)
          },
          height: { 
            xs: 'calc(100vh - 110px)',  // Móvil: forzar altura completa exacta
            sm: `${HEIGHTS.studyContainer.sm}px`,  // Tablet: 650px
            md: `${HEIGHTS.studyContainer.md}px`,  // Desktop mediano: 750px
            lg: `${HEIGHTS.studyContainer.lg}px`,  // Desktop grande: 850px
            xl: `${HEIGHTS.studyContainer.xl}px`   // Desktop XL: 950px
          },
          display: 'flex',
          flexDirection: 'column',
          pt: .5,  // Padding superior pequeño
          px: 1.3,  // Padding horizontal pequeño
          pb: .5,  // Padding inferior pequeño
        }}
      >
        <StudySession
          selectedWords={selectedWords}
          duration={duration}
          drillTypes={drillTypes}
          onEndSession={handleEndSession}
        />
      </Box>
    );
  }
  
  // PÁGINA 3: CONFIGURACIÓN DE SESIÓN DE ESTUDIO

  return (
    <Box 
      data-testid="study-session-config-page"
      sx={{ 
      pt: .5,  // Sin padding superior
      px: 1.3,  // Sin padding horizontal
      pb: .5,  // Sin padding inferior
      minHeight: { 
        xs: 'calc(100vh - 110px)',  // Móvil: ajustado para llenar toda la pantalla
        sm: `${HEIGHTS.studyContainer.sm}px`,  // Tablet: 650px
        md: `${HEIGHTS.studyContainer.md}px`,  // Desktop mediano: 750px (aumentado)
        lg: `${HEIGHTS.studyContainer.lg}px`,  // Desktop grande: 850px (aumentado)
        xl: `${HEIGHTS.studyContainer.xl}px`   // Desktop XL: 950px (aumentado)
      },
      height: { 
        xs: 'calc(100vh - 110px)',  // Móvil: forzar altura completa exacta
        sm: `${HEIGHTS.studyContainer.sm}px`,  // Tablet: 650px
        md: `${HEIGHTS.studyContainer.md}px`,  // Desktop mediano: 750px
        lg: `${HEIGHTS.studyContainer.lg}px`,  // Desktop grande: 850px
        xl: `${HEIGHTS.studyContainer.xl}px`   // Desktop XL: 950px
      },
      display: 'flex',
      flexDirection: 'column'
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
  );
};


// Exportar el componente
export default PageCanvas;