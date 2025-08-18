/**
 * STUDY SESSION CONFIG PAGE COMPONENT
 * 
 * Este es un componente de PÁGINA completa que maneja:
 * - Su propio layout y centrado (como página independiente)
 * - La configuración de la sesión de estudio en múltiples pasos
 * - La navegación entre pasos de configuración
 * 
 * Como página, se encarga de su propia presentación visual,
 * igual que StudySession maneja la suya.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Page Component: Componente que representa una página completa
 * - Self-contained: Maneja su propio layout, no necesita wrappers externos
 * - Multi-step form: Formulario dividido en pasos secuenciales
 */

import React, { useState } from 'react';
import {
  Box,
  Button
} from '@mui/material';

// Iconos para navegación
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Importar componentes de cada paso
import ConfigStep1WordSelection from './config/ConfigStep1WordSelection';
import ConfigStep2DurationDrills from './config/ConfigStep2DurationDrills';

// Importar configuración centralizada de layout
import { getPageContainerSx, SECTION_SPACING } from '../../../config/pageLayout';

// Importar tipos
import type { DrillType, SessionDuration } from '../types';
import type { LatinWord } from '../../../components/global/WordCard';

/**
 * PROPS DEL COMPONENTE
 */
interface StudySessionConfigProps {
  // Datos compartidos con el componente padre
  selectedWords: LatinWord[];                           // Palabras seleccionadas
  onSelectionChange: (words: LatinWord[]) => void;      // Actualizar palabras
  duration: SessionDuration;                            // Duración seleccionada
  onDurationChange: (duration: SessionDuration) => void; // Actualizar duración
  drillTypes: DrillType[];                              // Tipos de ejercicios
  onDrillTypesChange: (types: DrillType[]) => void;     // Actualizar ejercicios
  onStartSession: () => void;                           // Iniciar la sesión
}

/**
 * COMPONENTE DE CONFIGURACIÓN DE SESIÓN DE ESTUDIO
 * 
 * Página completa que guía al usuario a través de la configuración
 * de una sesión de estudio personalizada.
 */
const StudySessionConfig: React.FC<StudySessionConfigProps> = ({
  selectedWords,
  onSelectionChange,
  duration,
  onDurationChange,
  drillTypes,
  onDrillTypesChange,
  onStartSession
}) => {
  // Estado del paso actual (0: palabras, 1: duración y ejercicios)
  const [currentStep, setCurrentStep] = useState(0);

  // Definición de pasos
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
   * 
   * Esta función verifica que se cumplan los requisitos
   * mínimos para continuar al siguiente paso.
   */
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedWords.length >= 5; // Mínimo 5 palabras
      case 1:
        return drillTypes.length > 0;     // Al menos un tipo de ejercicio
      default:
        return true;
    }
  };

  return (
    // CONTENEDOR DE PÁGINA - Usa configuración centralizada en modo fullscreen
    <Box
      data-testid="config-page-wrapper"
      sx={getPageContainerSx('fullscreen', 'standard')}
    >
      {/* CONTENEDOR DE CONTENIDO - Usa configuración centralizada tipo 'card' */}
      <Box 
        data-testid="study-session-config-page"
        sx={getPageContainerSx('card', 'standard')}
      >
        {/* CONTENIDO DE CADA PASO - Área principal */}
        <Box 
          data-testid="step-content-container"
          sx={{ 
            flexGrow: 1,  // Toma todo el espacio disponible verticalmente
            minHeight: '250px',
            // Control de scroll según el paso actual
            // Paso 1 (palabras) puede tener mucho contenido, paso 2 (config) es más compacto
            overflowY: currentStep === 0 ? 'auto' : 'hidden',
            overflowX: 'hidden',  // Nunca scroll horizontal
            padding: 1
          }}
        >
          {/* PASO 1: SELECCIONAR PALABRAS */}
          {currentStep === 0 && (
            <ConfigStep1WordSelection
              selectedWords={selectedWords}
              onSelectionChange={onSelectionChange}
              minWords={5}
              maxWords={30}
            />
          )}

          {/* PASO 2: DURACIÓN Y EJERCICIOS */}
          {currentStep === 1 && (
            <ConfigStep2DurationDrills
              duration={duration}
              onDurationChange={onDurationChange}
              drillTypes={drillTypes}
              onDrillTypesChange={onDrillTypesChange}
              onStartSession={onStartSession}
              canStartSession={selectedWords.length >= 5}
            />
          )}
        </Box>

        {/* NAVEGACIÓN ENTRE PASOS - Siempre visible en la parte inferior */}
        <Box 
          data-testid="navigation-buttons-container"
          sx={{ 
            mt: SECTION_SPACING.small,  // Margen superior usando constante centralizada
            padding: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex', 
            justifyContent: 'space-between',
            gap: 2  // Espacio entre botones
          }}
        >
          {/* BOTÓN ANTERIOR */}
          <Button
            data-testid="nav-button-back"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={currentStep === 0} // Deshabilitado en el primer paso
            sx={{ 
              fontSize: { xs: '1rem', sm: '0.875rem' },
              py: { xs: 1.5, sm: 1 }
            }}
          >
            Anterior
          </Button>
          
          {/* BOTÓN SIGUIENTE/COMENZAR */}
          <Button
            data-testid="nav-button-next"
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            onClick={() => {
              // En el último paso, "Comenzar" inicia la sesión
              if (currentStep === steps.length - 1) {
                onStartSession();
              } else {
                handleNext();
              }
            }}
            disabled={!canProceed()} // Deshabilitado si no cumple requisitos
            sx={{ 
              fontSize: { xs: '1rem', sm: '0.875rem' },
              py: { xs: 1.5, sm: 1 }
            }}
          >
            {/* Texto dinámico: "Comenzar" en el último paso, "Siguiente" en otros */}
            {currentStep === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StudySessionConfig;