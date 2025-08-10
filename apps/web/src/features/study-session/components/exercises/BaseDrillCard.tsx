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
  Stack,
  Chip,
  Divider,
  Fade
} from '@mui/material';
import { SPACING, RADIUS } from '../../constants/spacing';

/**
 * PROPS BASE PARA TODOS LOS DRILL CARDS
 * Esta interfaz define lo que TODOS los drill cards deben tener
 */
export interface BaseDrillCardProps {
  // Información del ejercicio
  title: string;                         // Título del ejercicio
  subtitle: string;                      // Instrucción
  icon: React.ReactNode;                 // Icono del tipo
  exerciseType: string;                  // Etiqueta del tipo
  
  // Estado del ejercicio
  isAnswered?: boolean;                  // Si ya se respondió
  isCorrect?: boolean;                   // Si la respuesta fue correcta
  feedbackMessage?: string;              // Mensaje de feedback personalizado
  
  // Callbacks (removed onNext - handled by DrillSessionComponent)
  
  // Configuración visual
  compact?: boolean;                     // Versión compacta
  maxWidth?: any;                        // Ancho máximo
  
  // Contenido del ejercicio (lo que varía entre tipos)
  exerciseContent: React.ReactNode;      // El contenido específico del ejercicio
  
  // Contenido de feedback opcional (además del mensaje)
  feedbackContent?: React.ReactNode;     // Contenido adicional de feedback
}

/**
 * BASE DRILL CARD - COMPONENTE BASE
 * 
 * Proporciona toda la estructura común para los drill cards:
 * - Encabezado con icono y tipo
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
  icon,
  exerciseType,
  isAnswered = false,
  isCorrect = false,
  feedbackMessage,
  compact = false,
  maxWidth = { xs: '100%', sm: 450, md: 500, lg: 550, xl: 600 },
  exerciseContent,
  feedbackContent
}) => {
  /**
   * OBTENER MENSAJE DE FEEDBACK POR DEFECTO
   */
  const getDefaultFeedback = () => {
    if (feedbackMessage) return feedbackMessage;
    return isCorrect 
      ? '¡Correcto! 🎉' 
      : 'Incorrecto. Intenta con la siguiente palabra.';
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth, 
        mx: 'auto' 
      }} 
      data-testid="base-drill-card"
    >
      <Paper
        elevation={3}
        sx={{
          p: compact ? SPACING.cardPaddingCompact : SPACING.cardPadding,
          borderRadius: RADIUS.large,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
        }}
      >
        {/* ENCABEZADO COMÚN PARA TODOS LOS DRILL CARDS */}
        <Box 
          sx={{ 
            mb: compact ? 2 : SPACING.componentGap, 
            textAlign: 'center' 
          }} 
          data-testid="drill-card-header"
        >
          {/* Tipo de ejercicio con icono */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            justifyContent="center"
            sx={{ mb: 0.5 }}
          >
            {icon}
            <Chip 
              label={exerciseType}
              color="secondary"
              size="small"
            />
          </Stack>
          
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
        
        <Divider sx={{ mb: SPACING.sectionGap }} />
        
        {/* CONTENIDO DEL EJERCICIO - ESPECÍFICO DE CADA TIPO */}
        <Box data-testid="drill-card-exercise-content">
          {exerciseContent as any}
        </Box>
        
        {/* SECCIÓN DE FEEDBACK Y ACCIONES - COMÚN */}
        {isAnswered && (
          <>
            {/* Mensaje de feedback */}
            <Fade in timeout={300}>
              <Box 
                sx={{ 
                  mt: SPACING.feedbackMargin.mt,
                  mb: SPACING.feedbackMargin.mb,
                  textAlign: 'center',
                  p: SPACING.cardPaddingCompact.xs,
                  borderRadius: RADIUS.small,
                  bgcolor: isCorrect 
                    ? 'rgba(0, 229, 204, 0.1)'  // Cyan transparente
                    : 'rgba(207, 102, 121, 0.1)',  // Soft red transparente
                  border: '1px solid',
                  borderColor: isCorrect ? 'success.main' : 'error.main'
                }}
                data-testid="feedback-message"
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: isCorrect ? 'success.main' : 'error.main',
                    fontWeight: 'medium'
                  }}
                >
                  {getDefaultFeedback()}
                </Typography>
                
                {/* Contenido adicional de feedback si existe */}
                {feedbackContent && (
                  <Box sx={{ mt: 1 }}>
                    {feedbackContent as any}
                  </Box>
                )}
              </Box>
            </Fade>
          </>
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
 *       icon={<MyIcon />}
 *       exerciseType="Tipo"
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