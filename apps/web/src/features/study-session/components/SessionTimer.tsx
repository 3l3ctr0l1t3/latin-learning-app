/**
 * SESSION TIMER COMPONENT
 * 
 * Muestra el tiempo transcurrido y restante de la sesión de estudio.
 * 
 * CONCEPTOS IMPORTANTES:
 * - useEffect con interval: Para actualizar el tiempo cada segundo
 * - Cleanup: Limpiar el interval cuando el componente se desmonta
 * - Formateo de tiempo: Convertir segundos a formato MM:SS
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import PauseIcon from '@mui/icons-material/Pause';

/**
 * PROPS DEL COMPONENTE
 */
interface SessionTimerProps {
  totalMinutes: number;                    // Duración total en minutos
  onTimeUp?: () => void;                   // Callback cuando se acaba el tiempo
  isPaused?: boolean;                      // Si el timer está pausado
}

/**
 * COMPONENTE DE TIMER DE SESIÓN
 * 
 * Muestra un timer con progreso visual
 */
const SessionTimer: React.FC<SessionTimerProps> = ({
  totalMinutes,
  onTimeUp,
  isPaused = false
}) => {
  // Estado para segundos transcurridos
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Calcular valores derivados
  const totalSeconds = totalMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const progressPercent = (elapsedSeconds / totalSeconds) * 100;
  
  /**
   * FORMATEAR TIEMPO A MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  /**
   * DETERMINAR COLOR SEGÚN TIEMPO RESTANTE
   */
  const getTimerColor = () => {
    const percentRemaining = (remainingSeconds / totalSeconds) * 100;
    if (percentRemaining > 50) return 'primary';
    if (percentRemaining > 20) return 'warning';
    return 'error';
  };
  
  // Effect para manejar el timer
  useEffect(() => {
    // No hacer nada si está pausado
    if (isPaused) return;
    
    // Crear interval para actualizar cada segundo
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const newValue = prev + 1;
        
        // Verificar si se acabó el tiempo
        if (newValue >= totalSeconds) {
          if (onTimeUp) onTimeUp();
          clearInterval(interval);
          return totalSeconds;
        }
        
        return newValue;
      });
    }, 1000);
    
    // Cleanup: limpiar interval al desmontar
    return () => clearInterval(interval);
  }, [isPaused, totalSeconds, onTimeUp]);
  
  return (
    <Box sx={{ 
      p: 1.5, 
      bgcolor: 'background.paper',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      minWidth: 120
    }} data-testid="session-timer-widget">
      {/* Timer compacto con solo el tiempo y barra */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 1,
        mb: 1
      }} data-testid="timer-display-container">
        <TimerIcon 
          sx={{ fontSize: 18 }}
          color={getTimerColor()}
          data-testid="timer-icon"
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: `${getTimerColor()}.main`,
            fontFamily: 'monospace',
            fontSize: '1.1rem'
          }}
          data-testid="text-timer-display"
        >
          {formatTime(remainingSeconds)}
        </Typography>
        {isPaused && (
          <PauseIcon 
            sx={{ fontSize: 16 }}
            color="warning"
            data-testid="pause-indicator-icon"
          />
        )}
      </Box>
      
      {/* Barra de progreso más delgada */}
      <LinearProgress 
        variant="determinate" 
        value={progressPercent}
        color={getTimerColor()}
        sx={{ 
          height: 4, 
          borderRadius: 1,
          bgcolor: 'action.disabledBackground'
        }}
        data-testid="timer-progress-bar"
      />
    </Box>
  );
};

export default SessionTimer;