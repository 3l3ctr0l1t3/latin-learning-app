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
  Container,
  Paper,
  Button
} from '@mui/material';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Importar nuestros componentes
import ConfigStep1WordSelection from '../study-session/components/ConfigStep1WordSelection';
import ConfigStep2DurationDrills from '../study-session/components/ConfigStep2DurationDrills';
import ConfigStep3Review from '../study-session/components/ConfigStep3Review';

// Importar tipos
import type { DrillType, SessionDuration } from '../study-session/types';
import type { LatinWord } from '../study-session/components/WordCard';

/**
 * PÁGINA DE CONFIGURACIÓN DE SESIÓN DE ESTUDIO
 * 
 * Esta página permite al usuario configurar una sesión de estudio:
 * 1. Seleccionar palabras para estudiar
 * 2. Elegir la duración de la sesión
 * 3. Seleccionar tipos de ejercicios
 * 4. Revisar y comenzar la sesión
 */
const StudySessionConfigPage: React.FC = () => {
  // Estados para la configuración de la sesión
  const [selectedWords, setSelectedWords] = useState<LatinWord[]>([]);
  const [duration, setDuration] = useState<SessionDuration>(10);
  const [drillTypes, setDrillTypes] = useState<DrillType[]>(['multipleChoice']);
  const [currentStep, setCurrentStep] = useState(0); // Para navegación por pasos

  // Pasos de configuración
  const steps = [
    'Seleccionar Palabras',
    'Duración y Ejercicios',
    'Revisar y Comenzar'
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

  return (
    <Box 
      data-testid="study-session-config-page"
      sx={{ 
      pt: 0,  // Sin padding superior
      px: 0,  // Sin padding horizontal
      pb: 0,  // Sin padding inferior
      minHeight: { 
        xs: 'calc(100vh - 110px)',  // Móvil: ajustado para llenar toda la pantalla
        sm: '500px'  // Desktop: altura fija
      },
      height: { 
        xs: 'calc(100vh - 110px)',  // Móvil: forzar altura completa exacta
        sm: 'auto'  // Desktop: altura automática
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
          overflowY: 'auto',  // Permitir scroll si el contenido es muy largo
          overflowX: 'hidden'  // Evitar scroll horizontal
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

        {/* PASO 2: DURACIÓN Y EJERCICIOS - Usando componente optimizado */}
        {currentStep === 1 && (
          <ConfigStep2DurationDrills
            duration={duration}
            onDurationChange={setDuration}
            drillTypes={drillTypes}
            onDrillTypesChange={setDrillTypes}
          />
        )}

        {/* PASO 3: REVISAR Y COMENZAR - Usando componente optimizado */}
        {currentStep === 2 && (
          <ConfigStep3Review
            selectedWords={selectedWords}
            duration={duration}
            drillTypes={drillTypes}
            onStartSession={() => {
              console.log('Comenzar sesión con:', {
                words: selectedWords,
                duration,
                drillTypes
              });
            }}
          />
        )}
      </Box>

      {/* NAVEGACIÓN ENTRE PASOS */}
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
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 || !canProceed()}
          sx={{ 
            fontSize: { xs: '1rem', sm: '0.875rem' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Siguiente
        </Button>
      </Box>
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
      <Box data-testid="page-canvas-wrapper" maxWidth="xl" sx={{ py: { xs: 1, sm: 3, md: 4 }, m: { xs: 1, sm: 2, md: 3 , xl:2} }}>
        
        {/* CONTENEDOR PRINCIPAL */}
        <Paper data-testid="main-container" sx={{ width: '100%', p: { xs: 1, sm: 3 },  pb: { xs: 1.2, sm: 1.2, l:1.2, xl:2 }, }}>
          <StudySessionConfigPage />
        </Paper>

      </Box>
  );
};

// Exportar el componente
export default PageCanvas;