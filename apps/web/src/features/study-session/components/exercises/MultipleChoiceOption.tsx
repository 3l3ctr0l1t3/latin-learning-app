/**
 * COMPONENTE DE OPCIÓN INDIVIDUAL PARA MULTIPLE CHOICE
 * 
 * Representa una sola opción en un ejercicio de opción múltiple.
 * Maneja su propio estado visual según si está seleccionada,
 * si es correcta, y si ya se respondió.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Componente presentacional: Solo muestra UI, no maneja lógica de negocio
 * - Props para estado: Recibe todo lo que necesita para mostrarse
 * - Feedback visual: Cambia colores según el estado
 */

import React from 'react';
import {
  Box,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * PROPS DEL COMPONENTE
 */
interface MultipleChoiceOptionProps {
  // Datos de la opción
  id: string;                           // ID único de la opción
  text: string;                         // Texto a mostrar
  
  // Estado de la opción
  isSelected: boolean;                  // Si está seleccionada actualmente
  isCorrect: boolean;                   // Si es la respuesta correcta
  isAnswered: boolean;                  // Si ya se respondió la pregunta
  isDisabled?: boolean;                 // Si está deshabilitada
  
  // Callbacks
  onSelect: (id: string) => void;       // Cuando se selecciona esta opción
}

/**
 * COMPONENTE DE OPCIÓN DE MULTIPLE CHOICE
 * 
 * Muestra una opción con radio button, texto, y feedback visual
 */
const MultipleChoiceOption: React.FC<MultipleChoiceOptionProps> = ({
  id,
  text,
  isSelected,
  isCorrect,
  isAnswered,
  isDisabled = false,
  onSelect
}) => {
  /**
   * DETERMINAR COLOR DEL BORDE
   * - Verde si es correcta y ya se respondió
   * - Rojo si está seleccionada, es incorrecta y ya se respondió
   * - Default (divider) en otros casos
   */
  const getBorderColor = () => {
    if (!isAnswered) return 'divider';
    
    if (isCorrect) return 'success.main';
    if (isSelected && !isCorrect) return 'error.main';
    return 'divider';
  };

  /**
   * DETERMINAR COLOR DE FONDO
   * - Verde oscuro si es correcta y ya se respondió
   * - Rojo oscuro si está seleccionada incorrectamente
   * - Fondo default en otros casos
   */
  const getBackgroundColor = () => {
    if (!isAnswered) return 'background.default';
    
    if (isCorrect) return 'success.dark';
    if (isSelected && !isCorrect) return 'error.dark';
    return 'background.default';
  };

  /**
   * DETERMINAR QUÉ ICONO MOSTRAR
   * - Check verde si es correcta
   * - X roja si está seleccionada incorrectamente
   * - Null en otros casos
   */
  const getIcon = () => {
    if (!isAnswered) return null;
    
    if (isCorrect) return <CheckCircleIcon color="success" data-testid={`correct-icon-${id}`} />;
    if (isSelected && !isCorrect) return <CancelIcon color="error" data-testid={`incorrect-icon-${id}`} />;
    return null;
  };

  return (
    <Box
      sx={{
        // Espaciado y bordes
        mb: 2,
        p: 2,
        border: '2px solid',
        borderColor: getBorderColor(),
        borderRadius: 1,
        
        // Color de fondo con transparencia
        backgroundColor: getBackgroundColor(),
        
        // Transición suave para cambios de color
        transition: 'all 0.3s ease',
        
        // Hover effect solo si no está respondida
        ...(!isAnswered && !isDisabled && {
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer'
          }
        }),
        
        // Opacidad reducida si está deshabilitada
        opacity: isDisabled ? 0.6 : 1
      }}
      onClick={() => !isAnswered && !isDisabled && onSelect(id)}
      data-testid={`multiple-choice-option-${id}`}
    >
      <FormControlLabel
        value={id}
        control={
          <Radio 
            checked={isSelected}
            disabled={isAnswered || isDisabled}
            // onChange manejado por onClick del Box
            onChange={() => {}}
            data-testid={`radio-option-${id}`}
          />
        }
        data-testid={`form-control-label-${id}`}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} data-testid={`option-label-container-${id}`}>
            {/* Texto de la opción */}
            <Typography
              sx={{
                fontWeight: isSelected ? 'bold' : 'normal'
              }}
              data-testid={`text-option-${id}`}
            >
              {text}
            </Typography>
            
            {/* Icono de feedback (solo después de responder) */}
            {getIcon() && (
              <Box data-testid={`feedback-icon-${id}`}>
                {getIcon()}
              </Box>
            )}
          </Box>
        }
        sx={{ 
          m: 0, 
          width: '100%',
          // Evitar que el label capture clicks
          pointerEvents: isAnswered || isDisabled ? 'none' : 'auto'
        }}
      />
    </Box>
  );
};

export default MultipleChoiceOption;