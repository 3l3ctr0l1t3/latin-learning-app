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
  Chip,
  Stack,
  Alert
} from '@mui/material';
import StudyWordsViewer from './StudyWordsViewer';
import SessionTimer from './SessionTimer';
import type { LatinWord } from './WordCard';
import type { DrillType, SessionDuration } from '../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

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
 * Maneja el flujo completo de una sesión de estudio
 */
const StudySession: React.FC<StudySessionProps> = ({
  selectedWords,
  duration,
  drillTypes,
  onEndSession
}) => {
  // Estado de la fase actual
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('review');
  
  // Estado para pausar el timer
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  
  // Estado para rastrear si el tiempo se acabó
  const [timeIsUp, setTimeIsUp] = useState(false);
  
  /**
   * MANEJADORES DE TRANSICIÓN ENTRE FASES
   */
  const handleContinueToExercises = () => {
    setCurrentPhase('exercises');
  };
  
  const handleFinishExercises = () => {
    setCurrentPhase('summary');
  };
  
  const handleTimeUp = () => {
    setTimeIsUp(true);
    setCurrentPhase('summary');
  };
  
  /**
   * OBTENER ICONO Y COLOR PARA LA FASE ACTUAL
   */
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
  
  return (
    <Box sx={{ 
      height: '100%', 
      minHeight: {
        xs: 'calc(100vh - 64px)',  // Móvil: pantalla completa menos AppBar
        md: '600px',  // Desktop mediano: altura consistente
        lg: '650px',  // Desktop grande: altura consistente
        xl: '700px'   // Desktop XL: altura consistente
      },
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative' 
    }} data-testid="study-session-container">
      {/* HEADER SIMPLIFICADO CON TIMER EN ESQUINA */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 2,
        gap: 2
      }} data-testid="study-session-header">
        {/* Botón de finalizar sesión (izquierda) */}
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onEndSession}
          data-testid="button-end-session"
        >
          Finalizar Sesión
        </Button>
        
        {/* Timer compacto (derecha) */}
        <Box sx={{ minWidth: 150 }} data-testid="session-timer-container">
          <SessionTimer
            totalMinutes={duration}
            onTimeUp={handleTimeUp}
            isPaused={isTimerPaused}
          />
        </Box>
      </Box>
      
      {/* Alerta si se acabó el tiempo */}
      {timeIsUp && (
        <Alert severity="warning" sx={{ mb: 2 }} data-testid="alert-time-up">
          ¡Se acabó el tiempo! Finalizando la sesión...
        </Alert>
      )}
      
      {/* CONTENIDO DE LA FASE ACTUAL */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }} data-testid="study-session-content">
        {/* FASE 1: REVISIÓN DE PALABRAS */}
        {currentPhase === 'review' && (
          <Box data-testid="phase-review">
            <StudyWordsViewer
              words={selectedWords}
              onContinueToExercises={handleContinueToExercises}
              showTranslation={true}
            />
          </Box>
        )}
        
        {/* FASE 2: EJERCICIOS */}
        {currentPhase === 'exercises' && (
          <Paper sx={{ p: 3, textAlign: 'center' }} data-testid="phase-exercises">
            <Typography variant="h5" gutterBottom data-testid="text-exercises-title">
              Fase de Ejercicios
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph data-testid="text-exercises-description">
              Los ejercicios están en desarrollo...
            </Typography>
            <Typography variant="body2" paragraph data-testid="text-drill-types-list">
              Tipos de ejercicios seleccionados: {drillTypes.join(', ')}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleFinishExercises}
              sx={{ mt: 2 }}
              data-testid="button-finish-exercises"
            >
              Finalizar Ejercicios
            </Button>
          </Paper>
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
  );
};

export default StudySession;