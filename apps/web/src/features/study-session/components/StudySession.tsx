/**
 * STUDY SESSION COMPONENT
 * 
 * Componente principal de la sesión de estudio que maneja todas las fases:
 * 1. Revisión de palabras (estudio)
 * 2. Ejercicios de práctica
 * 3. Resumen de resultados
 * 
 * CONCEPTOS IMPORTANTES:
 * - Estado de fase: Controla en qué parte de la sesión estamos
 * - Timer global: Rastrea el tiempo total de la sesión
 * - Datos de sesión: Mantiene palabras, configuración y resultados
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  Chip
} from '@mui/material';
import StudyWordsViewerWithNavigation from './StudyWordsViewerWithNavigation';
import SessionTimer from '../../../components/global/SessionTimer';
import DrillSessionComponent from '../../../components/exercises/DrillSessionComponent';
import type { LatinWord } from '../../../components/global/WordCard';
import type { DrillType, SessionDuration } from '../types';
import type { DrillType as DrillSessionType } from '../../../components/exercises/DrillSessionComponent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SkipNextIcon from '@mui/icons-material/SkipNext';
// Importar configuración centralizada de layout
import { getPageContainerSx } from '../../../config/pageLayout';
// Comentados - se usarán cuando implementemos la función getPhaseInfo
// import SchoolIcon from '@mui/icons-material/School';
// import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

/**
 * FASES DE LA SESIÓN
 */
type SessionPhase = 'review' | 'exercises' | 'summary';

/**
 * PROPS DEL COMPONENTE
 */
interface StudySessionProps {
  selectedWords: LatinWord[];              // Palabras seleccionadas
  duration: SessionDuration;               // Duración en minutos
  drillTypes: DrillType[];                 // Tipos de ejercicios
  onEndSession: () => void;                // Callback al terminar
}

/**
 * COMPONENTE DE SESIÓN DE ESTUDIO
 * 
 * Este es un componente de PÁGINA completa que maneja:
 * - Su propio layout y centrado
 * - El flujo completo de una sesión de estudio
 * - Las tres fases: revisión, ejercicios, resumen
 * 
 * Como página, se encarga de su propia presentación visual
 */
const StudySession: React.FC<StudySessionProps> = ({
  selectedWords,
  duration,
  drillTypes,
  onEndSession
}) => {
  // Estado de la fase actual
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('review');
  
  // Estado para pausar el timer - se usará en futuras implementaciones
  const [isTimerPaused] = useState(false);
  
  // Estado para rastrear si el tiempo se acabó
  const [timeIsUp, setTimeIsUp] = useState(false);
  
  // Estado para rastrear resultados de ejercicios
  const [drillResults, setDrillResults] = useState<any[]>([]);
  
  /**
   * MANEJADORES DE TRANSICIÓN ENTRE FASES
   */
  const handleContinueToExercises = () => {
    setCurrentPhase('exercises');
  };
  
  const handleFinishExercises = (results?: any[]) => {
    // Guardar resultados si se proporcionan
    if (results) {
      setDrillResults(results);
    }
    // Cambiar a la fase de resumen
    setCurrentPhase('summary');
  };
  
  // Nuevo manejador para actualizar resultados en tiempo real
  const handleDrillComplete = (results: any[]) => {
    // Solo actualizar los resultados, sin cambiar de fase
    setDrillResults(results);
  };
  
  const handleTimeUp = () => {
    setTimeIsUp(true);
    setCurrentPhase('summary');
  };
  
  // Función getPhaseInfo comentada - se usará en futuras implementaciones
  // cuando necesitemos mostrar información de la fase actual
  /*
  const getPhaseInfo = () => {
    switch (currentPhase) {
      case 'review':
        return {
          icon: <SchoolIcon />,
          label: 'Fase de Estudio',
          color: 'info' as const
        };
      case 'exercises':
        return {
          icon: <FitnessCenterIcon />,
          label: 'Fase de Ejercicios',
          color: 'success' as const
        };
      case 'summary':
        return {
          icon: <CheckCircleIcon />,
          label: 'Resumen de Sesión',
          color: 'primary' as const
        };
    }
  };
  
  const phaseInfo = getPhaseInfo();
  */
  
  return (
    // CONTENEDOR DE PÁGINA - Usa configuración centralizada en modo fullscreen
    <Box
      data-testid="study-session-page"
      sx={getPageContainerSx('fullscreen', 'standard')}
    >
      {/* CONTENEDOR DE CONTENIDO - Usa configuración centralizada tipo 'card' */}
      <Box sx={getPageContainerSx('card', 'standard')}>
        {/* CONTENIDO DE LA SESIÓN - El componente original */}
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }} data-testid="study-session-container">
      {/* HEADER SIMPLIFICADO CON TIMER, ESTADÍSTICAS Y BOTÓN */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        gap: 2
      }} data-testid="study-session-header">
        {/* Timer y estadísticas (izquierda) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ minWidth: 150 }} data-testid="session-timer-container">
            <SessionTimer
              totalMinutes={duration}
              onTimeUp={handleTimeUp}
              isPaused={isTimerPaused}
            />
          </Box>
          
          {/* Estadísticas de ejercicios - solo visible en fase de ejercicios */}
          {currentPhase === 'exercises' && (
            <Stack direction="column" spacing={0.5} data-testid="exercise-stats">
              <Chip
                icon={<CheckCircleIcon />}
                label={drillResults.filter((r: any) => r.isCorrect).length}
                color="success"
                size="small"
                sx={{ minWidth: 60 }}
              />
              <Chip
                icon={<CancelIcon />}
                // Mostrar solo respuestas incorrectas (NO saltadas)
                // wasSkipped indica que el usuario no intentó responder
                label={drillResults.filter((r: any) => !r.isCorrect && !r.wasSkipped).length}
                color="error"
                size="small"
                sx={{ minWidth: 60 }}
              />
              {/* NUEVO: Mostrar ejercicios saltados si hay alguno */}
              {drillResults.some((r: any) => r.wasSkipped) && (
                <Chip
                  icon={<SkipNextIcon />}
                  label={drillResults.filter((r: any) => r.wasSkipped).length}
                  color="default"
                  size="small"
                  sx={{ minWidth: 60 }}
                />
              )}
            </Stack>
          )}
        </Box>
        
        {/* Botón de finalizar sesión (derecha) */}
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onEndSession}
          data-testid="button-end-session"
        >
          Finalizar Sesión
        </Button>
      </Box>
      
      {/* Alerta si se acabó el tiempo */}
      {timeIsUp && (
        <Alert severity="warning" sx={{ mb: 2 }} data-testid="alert-time-up">
          ¡Se acabó el tiempo! Finalizando la sesión...
        </Alert>
      )}
      
      {/* CONTENIDO DE LA FASE ACTUAL */}
      {/* Box con flexGrow: 1 toma todo el espacio disponible en el contenedor flex */}
      {/* display: flex y flexDirection: column lo convierten en contenedor flex vertical */}
      <Box sx={{ 
        flexGrow: 1,  // Toma todo el espacio disponible del contenedor padre
        overflow: 'auto',  // Permite scroll si el contenido es muy largo
        display: 'flex',  // Convierte este Box en contenedor flex
        flexDirection: 'column'  // Los hijos se apilan verticalmente
      }} data-testid="study-session-content">
        {/* FASE 1: REVISIÓN DE PALABRAS */}
        {currentPhase === 'review' && (
          <Box sx={{ 
            height: '100%',  // Ocupa toda la altura del contenedor padre
            display: 'flex',  // También es un contenedor flex
            flexDirection: 'column'  // Para que StudyWordsViewer pueda expandirse
          }} data-testid="phase-review">
            <StudyWordsViewerWithNavigation
              words={selectedWords}
              onContinueToExercises={handleContinueToExercises}
              showTranslation={true}
            />
          </Box>
        )}
        
        {/* FASE 2: EJERCICIOS */}
        {currentPhase === 'exercises' && (
          <Box sx={{ 
            height: '100%',  // Ocupa toda la altura disponible
            display: 'flex',
            flexDirection: 'column'
          }} data-testid="phase-exercises">
            <DrillSessionComponent
              selectedWords={selectedWords}
              drillTypes={drillTypes as DrillSessionType[]}  // Conversión de tipos
              sessionDurationMinutes={duration}  // Duración en minutos
              onSessionEnd={handleFinishExercises}  // Callback cuando termine
              onDrillComplete={handleDrillComplete}  // Callback para actualizar resultados en tiempo real
            />
          </Box>
        )}
        
        {/* FASE 3: RESUMEN */}
        {currentPhase === 'summary' && (
          <Paper sx={{ p: 3, textAlign: 'center' }} data-testid="phase-summary">
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 60, mb: 2 }}
              data-testid="success-icon"
            />
            <Typography variant="h4" gutterBottom data-testid="text-session-completed">
              ¡Sesión Completada!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph data-testid="text-session-summary">
              Has estudiado {selectedWords.length} palabras durante {duration} minutos.
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 3, maxWidth: 400, mx: 'auto' }} data-testid="session-stats-container">
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.default',
                borderRadius: 1,
                textAlign: 'left'
              }} data-testid="session-stats-box">
                <Typography variant="subtitle2" color="text.secondary" data-testid="text-stats-title">
                  Estadísticas de la sesión:
                </Typography>
                <Typography variant="body2" data-testid="text-stats-words">
                  • Palabras revisadas: {selectedWords.length}
                </Typography>
                <Typography variant="body2" data-testid="text-stats-duration">
                  • Duración: {duration} minutos
                </Typography>
                <Typography variant="body2" data-testid="text-stats-drill-types">
                  • Tipos de ejercicios: {drillTypes.length}
                </Typography>
                {drillResults.length > 0 && (
                  <>
                    <Typography variant="body2" data-testid="text-stats-exercises">
                      • Ejercicios completados: {drillResults.length}
                    </Typography>
                    <Typography variant="body2" data-testid="text-stats-accuracy">
                      • Precisión: {Math.round((drillResults.filter((r: any) => r.isCorrect).length / drillResults.length) * 100)}%
                    </Typography>
                  </>
                )}
              </Box>
              
              <Button 
                variant="contained" 
                size="large"
                onClick={onEndSession}
                data-testid="button-return-to-start"
              >
                Volver al Inicio
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StudySession;