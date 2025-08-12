/**
 * COMPONENTE DE OPCIÓN INDIVIDUAL PARA MULTIPLE CHOICE
 * 
 * Diseño limpio y moderno con feedback visual mediante bordes.
 * NO cambia el color de fondo, solo usa bordes para indicar estado.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Diseño minimalista: Interfaz limpia sin distracciones
 * - Feedback sutil: Bordes para indicar correcto/incorrecto
 * - Accesibilidad: Alto contraste y estados claros
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

/**
 * PROPS DEL COMPONENTE
 */
interface MultipleChoiceOptionProps {
  // Datos de la opción
  id: string;                           // ID único de la opción  
  text: string;                         // Texto a mostrar
  label?: string;                       // Etiqueta opcional (A, B, C, D)
  
  // Estado de la opción
  isSelected: boolean;                  // Si está seleccionada actualmente
  isCorrect: boolean;                   // Si es la respuesta correcta
  isAnswered: boolean;                  // Si ya se respondió la pregunta
  isDisabled?: boolean;                 // Si está deshabilitada
  
  // Callbacks
  onSelect: (id: string) => void;       // Cuando se selecciona esta opción
}

/**
 * COMPONENTE DE OPCIÓN DE MULTIPLE CHOICE - DISEÑO NUEVO
 * 
 * Tarjeta elegante con bordes que cambian de color según el estado
 */
const MultipleChoiceOption: React.FC<MultipleChoiceOptionProps> = ({
  id,
  text,
  label,
  isSelected,
  isCorrect,
  isAnswered,
  isDisabled = false,
  onSelect
}) => {
  // Usar el tema para acceder a los colores
  const theme = useTheme();
  /**
   * DETERMINAR COLOR Y GROSOR DEL BORDE
   * - Verde brillante (3px) si es correcta y ya se respondió
   * - Rojo brillante (3px) si está seleccionada incorrectamente  
   * - Púrpura (2px) si está seleccionada pero no respondida
   * - Púrpura sutil (1px) para opciones no seleccionadas (antes de responder)
   * - Gris sutil (1px) para opciones no seleccionadas (después de responder)
   */
  const getBorderStyle = () => {
    // Después de responder
    if (isAnswered) {
      if (isCorrect) {
        return {
          borderWidth: 3,
          borderColor: theme.palette.success.main,  // Color success del tema (cyan)
          borderStyle: 'solid'
        };
      }
      if (isSelected && !isCorrect) {
        return {
          borderWidth: 3,
          borderColor: theme.palette.error.main,  // Color error del tema (soft red)
          borderStyle: 'solid'
        };
      }
      // Opciones no seleccionadas después de responder
      return {
        borderWidth: 1,
        borderColor: 'divider',  // Gris sutil
        borderStyle: 'solid'
      };
    }
    
    // Antes de responder
    if (isSelected) {
      return {
        borderWidth: 2,
        borderColor: '#BB86FC',  // Púrpura del tema más prominente
        borderStyle: 'solid'
      };
    }
    
    // Estado normal (no seleccionado, no respondido)
    // Usar púrpura sutil para todas las opciones no seleccionadas
    return {
      borderWidth: 1,
      borderColor: 'rgba(187, 134, 252, 0.4)',  // Púrpura del tema con transparencia
      borderStyle: 'solid'
    };
  };

  /**
   * OBTENER ICONO DE ESTADO
   * Solo muestra iconos después de responder
   */
  const getStatusIcon = () => {
    if (!isAnswered) return null;
    
    if (isCorrect) {
      return (
        <CheckCircleOutlineIcon 
          sx={{ color: theme.palette.success.main, fontSize: 28 }}
          data-testid={`correct-icon-${id}`}
        />
      );
    }
    
    if (isSelected && !isCorrect) {
      return (
        <HighlightOffIcon 
          sx={{ color: theme.palette.error.main, fontSize: 28 }}
          data-testid={`incorrect-icon-${id}`}
        />
      );
    }
    
    return null;
  };

  /**
   * OBTENER ICONO DE SELECCIÓN
   * Radio button personalizado
   */
  const getSelectionIcon = () => {
    if (isSelected) {
      return <RadioButtonCheckedIcon sx={{ color: isAnswered ? 'text.secondary' : 'primary.main' }} />;
    }
    return <RadioButtonUncheckedIcon sx={{ color: 'text.secondary' }} />;
  };

  return (
    <Paper
      elevation={0}  // Sin elevación para integrarse mejor
      sx={{
        // Espaciado
        mb: { xs: 1, sm: 1.25, md: 1.5 },  // Menos margen entre opciones en móvil
        p: 0,  // Sin padding, lo manejamos internamente
        
        // Borde dinámico
        ...getBorderStyle(),
        
        // Esquinas redondeadas
        borderRadius: 1.5,
        
        // Fondo sutil diferente del Paper principal
        backgroundColor: isSelected && !isAnswered ? 'action.selected' : 'background.default',
        
        // Transiciones suaves
        transition: 'all 0.2s ease-in-out',
        
        // Efectos hover solo cuando es interactivo
        ...(!isAnswered && !isDisabled && {
          '&:hover': {
            transform: 'translateX(4px)',  // Ligero desplazamiento horizontal
            boxShadow: 3,
            borderColor: isSelected ? '#BB86FC' : 'rgba(187, 134, 252, 0.7)',  // Púrpura más visible en hover
            cursor: 'pointer'
          }
        }),
        
        // Estado deshabilitado
        ...(isDisabled && {
          opacity: 0.5,
          cursor: 'not-allowed'
        })
      }}
      onClick={() => !isAnswered && !isDisabled && onSelect(id)}
      data-testid={`multiple-choice-option-${id}`}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: { xs: 1.5, sm: 1.75, md: 2 },  // Padding interno reducido en móvil
          gap: { xs: 1, sm: 1.25, md: 1.5 }  // Espaciado entre elementos más ajustado
        }}
      >
        {/* COLUMNA IZQUIERDA: Etiqueta opcional o icono de selección */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 40
          }}
        >
          {label ? (
            // Si hay etiqueta (A, B, C, D), mostrarla en un círculo
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Usar púrpura para mantener consistencia con el tema
                backgroundColor: isSelected && !isAnswered ? '#BB86FC' : 'rgba(187, 134, 252, 0.15)',
                color: isSelected && !isAnswered ? 'white' : 'text.primary',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease'
              }}
              data-testid={`option-label-${id}`}
            >
              {label}
            </Box>
          ) : (
            // Si no hay etiqueta, mostrar radio button
            <Box data-testid={`radio-${id}`}>
              {getSelectionIcon()}
            </Box>
          )}
        </Box>

        {/* COLUMNA CENTRAL: Texto de la opción */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
              lineHeight: 1.6,
              color: 'text.primary',
              // Texto en negrita si está seleccionada
              fontWeight: isSelected && !isAnswered ? 500 : 400
            }}
            data-testid={`text-option-${id}`}
          >
            {text}
          </Typography>
        </Box>

        {/* COLUMNA DERECHA: Icono de feedback (solo después de responder) */}
        {getStatusIcon() && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              animation: isAnswered ? 'fadeIn 0.3s ease-in' : 'none',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'scale(0.8)' },
                to: { opacity: 1, transform: 'scale(1)' }
              }
            }}
            data-testid={`feedback-icon-${id}`}
          >
            {getStatusIcon()}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default MultipleChoiceOption;