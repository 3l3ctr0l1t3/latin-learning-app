/**
 * PAGE CANVAS - Página de configuración de sesión de estudio
 * 
 * Esta página muestra el flujo completo de configuración de sesión
 * con múltiples pasos y componentes trabajando juntos.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Composición de páginas: Cómo los componentes trabajan juntos
 * - Flujo de datos: Cómo pasa la información entre componentes
 * - Layout y estructura: Cómo organizar componentes en una página
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

// Importar nuestros componentes
import ConfigStep1WordSelection from '../study-session/components/ConfigStep1WordSelection';
import ConfigStep2DurationDrills from '../study-session/components/ConfigStep2DurationDrills';
import StudySession from '../study-session/components/StudySession';

// Importar tipos
import type { DrillType, SessionDuration } from '../study-session/types';
import type { LatinWord } from '../study-session/components/WordCard';

/**
 * PÁGINA DE CONFIGURACIÓN DE SESIÓN DE ESTUDIO
 * 
 * Esta página permite al usuario configurar una sesión de estudio:
 * 1. Seleccionar palabras para estudiar
 * 2. Elegir la duración, tipos de ejercicios y comenzar la sesión
 */
const StudySessionConfigPage: React.FC = () => {
  // Estados para la configuración de la sesión
  const [selectedWords, setSelectedWords] = useState<LatinWord[]>([]);
  const [duration, setDuration] = useState<SessionDuration>(10);
  const [drillTypes, setDrillTypes] = useState<DrillType[]>(['multipleChoice']);
  const [currentStep, setCurrentStep] = useState(0); // Para navegación por pasos
  const [sessionStarted, setSessionStarted] = useState(false); // Estado para sesión activa

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
   * MANEJADOR PARA INICIAR SESIÓN
   */
  const handleStartSession = () => {
    setSessionStarted(true);
  };
  
  /**
   * MANEJADOR PARA FINALIZAR SESIÓN
   */
  const handleEndSession = () => {
    setSessionStarted(false);
    setCurrentStep(0); // Volver al inicio
    // Opcionalmente, limpiar las selecciones
  };

  // Si la sesión está activa, mostrar el componente StudySession
  // IMPORTANTE: Mantener el mismo contenedor con altura definida
  if (sessionStarted) {
    return (
      <Box 
        data-testid="study-session-wrapper"
        sx={{ 
          // Mantener las mismas alturas que en la configuración
          minHeight: { 
            xs: 'calc(100vh - 110px)',  // Móvil: ajustado para llenar toda la pantalla
            md: '600px',  // Desktop mediano: altura consistente
            lg: '650px',  // Desktop grande: altura consistente
            xl: '700px'   // Desktop XL: altura consistente
          },
          height: { 
            xs: 'calc(100vh - 110px)',  // Móvil: forzar altura completa exacta
            md: '600px',  // Desktop mediano: altura fija
            lg: '650px',  // Desktop grande: altura fija
            xl: '700px'   // Desktop XL: altura fija
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

  return (
    <Box 
      data-testid="study-session-config-page"
      sx={{ 
      pt: .5,  // Sin padding superior
      px: 1.3,  // Sin padding horizontal
      pb: .5,  // Sin padding inferior
      minHeight: { 
        xs: 'calc(100vh - 110px)',  // Móvil: ajustado para llenar toda la pantalla
        md: '600px',  // Desktop mediano: altura consistente
        lg: '650px',  // Desktop grande: altura consistente
        xl: '700px'   // Desktop XL: altura consistente
      },
      height: { 
        xs: 'calc(100vh - 110px)',  // Móvil: forzar altura completa exacta
        md: '600px',  // Desktop mediano: altura fija
        lg: '650px',  // Desktop grande: altura fija
        xl: '700px'   // Desktop XL: altura fija
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

/**
 * PAGE CANVAS PRINCIPAL
 * 
 * Contenedor principal que muestra la configuración de sesión de estudio
 * sin tabs de navegación, enfocado únicamente en el flujo de configuración
 */
const PageCanvas: React.FC = () => {
  return (
    // Contenedor externo que centra el contenido
    <Box 
      data-testid="page-canvas-wrapper" 
      sx={{ 
        // Centrar horizontalmente con margin auto
        display: 'flex',
        justifyContent: 'center',
        py: { xs: 1, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        minHeight: 'calc(100vh - 64px)', // Altura total menos el AppBar
      }}
    >
      {/* Contenedor con ancho máximo para pantallas grandes */}
      <Box
        sx={{
          width: '100%',
          // Limitar el ancho máximo según el tamaño de pantalla
          maxWidth: {
            xs: '100%',     // Móvil: ancho completo
            sm: '600px',    // Tablets pequeñas: 600px
            md: '800px',    // Tablets: 800px
            lg: '900px',    // Desktop: 900px
            xl: '1000px'    // Desktop grande: 1000px
          }
        }}
      >
        {/* CONTENEDOR PRINCIPAL */}
        <Paper 
          data-testid="main-container" 
          sx={{ 
            width: '100%', 
            p: { 
              xs: 1,      // Móvil: padding pequeño
              sm: 2,      // Tablet: padding medio
              md: 3,      // Desktop: padding normal
              lg: 4       // Desktop grande: padding amplio
            },
            // Sombra más sutil para pantallas grandes
            boxShadow: {
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4
            }
          }}
        >
          <StudySessionConfigPage />
        </Paper>
      </Box>
    </Box>
  );
};

// Exportar el componente
export default PageCanvas;