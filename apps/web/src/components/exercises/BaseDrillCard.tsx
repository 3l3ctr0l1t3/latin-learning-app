/**
 * BASE DRILL CARD COMPONENT
 * 
 * Componente base abstracto para todas las tarjetas de ejercicio.
 * Define la estructura y comportamiento común que todos los drill cards deben tener.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Composition Pattern: En React no hay herencia de clases, usamos composición
 * - Abstract Interface: Define props que todos los drill cards deben implementar
 * - Render Props: Permite que los hijos controlen parte del renderizado
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Fade
} from '@mui/material';
import { SPACING, RADIUS, WIDTHS } from '../../features/study-session/constants/spacing';

/**
 * PROPS BASE PARA TODOS LOS DRILL CARDS
 * Esta interfaz define lo que TODOS los drill cards deben tener
 */
export interface BaseDrillCardProps {
  // Información del ejercicio
  title: string;                         // Título del ejercicio
  subtitle: string;                      // Instrucción

  // Estado del ejercicio
  isAnswered?: boolean;                  // Si ya se respondió
  isCorrect?: boolean;                   // Si la respuesta fue correcta
  feedbackMessage?: string;              // Mensaje de feedback personalizado
  

  // Configuración visual
  compact?: boolean;                     // Versión compacta
  maxWidth?: any;                        // Ancho máximo
  hideHeader?: boolean;                  // Ocultar encabezado para ahorrar espacio
  
  // Contenido del ejercicio (lo que varía entre tipos)
  exerciseContent: React.ReactNode;      // El contenido específico del ejercicio
  
  // Contenido de feedback opcional (además del mensaje)
  feedbackContent?: React.ReactNode;     // Contenido adicional de feedback
}

/**
 * BASE DRILL CARD - COMPONENTE BASE
 * 
 * Proporciona toda la estructura común para los drill cards:
 * - Área de contenido para el ejercicio
 * - Sección de feedback
 * - Botón de siguiente
 * 
 * Los componentes específicos (como MultipleChoiceDrillCard) 
 * usan este componente y le pasan el contenido específico.
 */
const BaseDrillCard: React.FC<BaseDrillCardProps> = ({
  title,
  subtitle,
  isAnswered = false,
  isCorrect = false,
  // feedbackMessage,  // Comentado - no se usa actualmente
  compact = false,
  maxWidth = WIDTHS.exerciseContainer,
  hideHeader = false,
  exerciseContent,
  feedbackContent
}) => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth, 
        mx: 'auto',
        height: '100%',  // Ocupar toda la altura disponible
        display: 'flex',  // Usar flexbox
        flexDirection: 'column'  // Dirección vertical
      }} 
      data-testid="base-drill-card"
    >
      <Paper
        elevation={3}
        sx={{
          p: compact ? SPACING.cardPaddingCompact : SPACING.cardPadding,
          borderRadius: RADIUS.large,
          bgcolor: 'background.paper',
          flex: 1,  // Permitir que el Paper crezca
          display: 'flex',  // Usar flexbox dentro del Paper
          flexDirection: 'column',  // Dirección vertical
          overflow: 'hidden',  // Prevenir overflow
          border: isAnswered ? '3px solid' : '1px solid',  // Borde más grueso cuando se responde
          borderColor: isAnswered 
            ? (isCorrect ? 'success.main' : 'error.main')  // Verde para correcto, rojo para incorrecto
            : 'divider',  // Borde normal antes de responder
          transition: 'all 0.3s ease',
          // Añadir un sutil glow cuando se responde
          boxShadow: isAnswered 
            ? (isCorrect 
              ? '0 0 20px rgba(0, 229, 204, 0.3)'  // Glow cyan para correcto
              : '0 0 20px rgba(207, 102, 121, 0.3)')  // Glow rojo para incorrecto
            : undefined,
        }}
      >
        {/* ENCABEZADO COMÚN PARA TODOS LOS DRILL CARDS - Solo si no está oculto */}
        {!hideHeader && (
          <>
            <Box 
              sx={{ 
                mb: { xs: 1, sm: 1.25, md: 1.5 },  // Más compacto en todas las pantallas
                textAlign: 'center' 
              }} 
              data-testid="drill-card-header"
            >
              {/* Título principal */}
              <Typography 
                variant={compact ? "body1" : "h6"}
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mb: 0.5
                }}
                data-testid="drill-card-title"
              >
                {title}
              </Typography>
              
              {/* Subtítulo/Instrucción */}
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: compact ? '0.75rem' : '0.85rem' }}
                data-testid="drill-card-subtitle"
              >
                {subtitle}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: { xs: 1, sm: 1.25, md: 1.5 } }} />
          </>
        )}
        
        {/* CONTENIDO DEL EJERCICIO - ESPECÍFICO DE CADA TIPO */}
        <Box 
          data-testid="drill-card-exercise-content"
          sx={{
            flex: 1,  // Permitir que el contenido crezca y ocupe espacio disponible
            display: 'flex',  // Usar flexbox
            flexDirection: 'column',  // Dirección vertical
            overflow: 'hidden',  // Prevenir scroll - el contenido debe ajustarse
            minHeight: 0  // Importante para que flex funcione correctamente
          }}
        >
          {exerciseContent as any}
        </Box>
        
        {/* CONTENIDO DE FEEDBACK ADICIONAL - Solo si se proporciona */}
        {/* Este es para tips educativos, explicaciones, etc. */}
        {isAnswered && feedbackContent && (
          <Fade in timeout={300}>
            <Box sx={{ 
              mt: SPACING.sectionGap,
              textAlign: 'center',
              // Estilo opcional para hacer el feedback más visible
              p: { xs: 1, sm: 1.5 },
              bgcolor: isCorrect 
                ? 'rgba(0, 229, 204, 0.05)'  // Fondo muy sutil cyan para correcto
                : 'rgba(207, 102, 121, 0.05)',  // Fondo muy sutil rojo para incorrecto
              borderRadius: RADIUS.small,
            }}>
              {feedbackContent as any}
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
};

export default BaseDrillCard;

/**
 * CÓMO USAR ESTE COMPONENTE BASE:
 * 
 * En lugar de herencia, los componentes específicos usan BaseDrillCard
 * y le pasan su contenido específico:
 * 
 * ```tsx
 * const MySpecificDrillCard = (props) => {
 *   return (
 *     <BaseDrillCard
 *       title="Mi Ejercicio"
 *       subtitle="Instrucciones"
 *       exerciseContent={
 *         // Aquí va el contenido específico del ejercicio
 *         <MyExerciseComponent {...props} />
 *       }
 *       isAnswered={isAnswered}
 *       isCorrect={isCorrect}
 *       onNext={handleNext}
 *     />
 *   );
 * };
 * ```
 * 
 * VENTAJAS DE ESTE PATRÓN:
 * 1. Reutilización de código común
 * 2. Consistencia visual garantizada
 * 3. Fácil agregar nuevos tipos de ejercicios
 * 4. Separación clara de responsabilidades
 * 5. Flexibilidad sin complejidad de herencia
 */