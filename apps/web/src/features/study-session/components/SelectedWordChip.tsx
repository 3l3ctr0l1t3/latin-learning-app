/**
 * SELECTED WORD CHIP COMPONENT
 * 
 * Un chip que muestra una palabra seleccionada con opción de eliminarla.
 * Se usa en listas de palabras seleccionadas para sesiones de estudio.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Chip deletable: Un chip que puede ser eliminado con un botón X
 * - Composition: Este componente es pequeño y se compone con otros
 * - Event bubbling: Manejar clicks en el chip vs clicks en el botón eliminar
 */

import React from 'react';
import {
  Chip,
  Avatar,    // Imagen circular o inicial dentro del chip
  Tooltip,
  Box,
  alpha,
} from '@mui/material';

// Iconos
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';

// Importar el tipo LatinWord
import type { LatinWord } from './WordCard';

// Importar colores centralizados
import { DECLENSION_COLORS } from '../constants/colors';

/**
 * PROPS DEL COMPONENTE
 */
interface SelectedWordChipProps {
  word: LatinWord;
  onDelete?: (wordId: string) => void;
  onClick?: (word: LatinWord) => void;
  // Variantes de visualización
  variant?: 'default' | 'compact' | 'detailed';
  // Mostrar información adicional en tooltip
  showTooltip?: boolean;
  // Color del chip basado en declinación (cambiado de género)
  colorByDeclension?: boolean;
  disabled?: boolean;
}

// Los colores de declinación ahora vienen del archivo centralizado
// Ver ../constants/colors.ts para el sistema completo de colores

/**
 * COMPONENTE SELECTED WORD CHIP
 * 
 * Muestra una palabra seleccionada como un chip interactivo.
 * Perfecto para listas de selección y visualización compacta.
 */
const SelectedWordChip: React.FC<SelectedWordChipProps> = ({
  word,
  onDelete,
  onClick,
  variant = 'default',
  showTooltip = true,
  colorByDeclension = true,  // Cambiado de colorByGender a colorByDeclension
  disabled = false
}) => {
  /**
   * MANEJADOR DE CLICK
   * Previene propagación si hay un onClick definido
   */
  const handleClick = (event: React.MouseEvent) => {
    if (onClick && !disabled) {
      // stopPropagation evita que el click se propague al contenedor padre
      event.stopPropagation();
      onClick(word);
    }
  };

  /**
   * MANEJADOR DE ELIMINACIÓN
   * Se ejecuta cuando se hace click en el botón X
   */
  const handleDelete = (event: React.MouseEvent) => {
    if (onDelete && !disabled) {
      // Prevenir que el click también active handleClick
      event.stopPropagation();
      onDelete(word.id);
    }
  };

  /**
   * DETERMINAR EL COLOR DEL CHIP
   * Ahora basado en declinación en lugar de género
   * Usa los colores centralizados de DECLENSION_COLORS
   */
  const chipColor = colorByDeclension ? DECLENSION_COLORS[word.declension] : undefined;

  /**
   * CREAR EL LABEL SEGÚN LA VARIANTE
   */
  const getChipLabel = () => {
    switch (variant) {
      case 'compact':
        // Solo el nominativo
        return word.nominative;
      
      case 'detailed':
        // Enunciación completa con género
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span style={{ fontWeight: 'bold' }}>
              {word.nominative}, {word.genitive}
            </span>
            <span style={{ opacity: 0.7, fontSize: '0.85em' }}>
              ({word.gender === 'masculine' ? 'm' : word.gender === 'feminine' ? 'f' : 'n'})
            </span>
          </Box>
        );
      
      default:
        // Nominativo y genitivo
        return `${word.nominative}, ${word.genitive}`;
    }
  };

  /**
   * CREAR EL CONTENIDO DEL TOOLTIP
   */
  const tooltipContent = (
    <Box>
      {/* Enunciación completa */}
      <Box sx={{ mb: 1 }}>
        <strong>{word.nominative}, {word.genitive}</strong>
      </Box>
      
      {/* Información gramatical */}
      <Box sx={{ fontSize: '0.85em' }}>
        <div>Género: {word.gender === 'masculine' ? 'Masculino' : 
                     word.gender === 'feminine' ? 'Femenino' : 'Neutro'}</div>
        <div>Declinación: {word.declension}</div>
      </Box>
      
      {/* Traducción */}
      <Box sx={{ mt: 1, fontStyle: 'italic' }}>
        {word.spanishTranslation}
      </Box>
    </Box>
  );

  /**
   * EL CHIP BASE
   */
  const chipElement = (
    <Chip
      // Avatar solo para la variante 'detailed', no para 'default' ni 'compact'
      avatar={
        variant === 'detailed' ? (
          <Avatar 
            sx={{ 
              bgcolor: colorByDeclension ? chipColor : 'primary.main',
              width: 24,
              height: 24
            }}
          >
            <SchoolIcon sx={{ fontSize: 16 }} />
          </Avatar>
        ) : undefined
      }
      label={getChipLabel()}
      onClick={onClick ? handleClick : undefined}
      onDelete={onDelete ? handleDelete : undefined}
      // deleteIcon personalizado (por defecto es una X)
      deleteIcon={
        <CloseIcon 
          sx={{ 
            fontSize: 18,
            '&:hover': {
              color: 'error.main'
            }
          }} 
        />
      }
      disabled={disabled}
      // Variante visual del chip
      variant={onClick ? 'outlined' : 'filled'}
      // Estilos personalizados
      sx={{
        // Color de fondo basado en declinación (con transparencia)
        bgcolor: colorByDeclension && !onClick
          ? alpha(chipColor || '#000', 0.15)
          : undefined,
        // Color del borde
        borderColor: colorByDeclension 
          ? chipColor
          : 'divider',
        // Cursor según interactividad
        cursor: onClick && !disabled ? 'pointer' : 'default',
        // Tamaño según variante
        height: variant === 'detailed' ? 'auto' : 32,
        py: variant === 'detailed' ? 1 : 0,
        // Fuente más grande para mejor legibilidad
        '& .MuiChip-label': {
          fontSize: variant === 'compact' ? '0.875rem' : '0.925rem',
          px: variant === 'compact' ? 1 : 1.5,
        },
        // Animaciones
        transition: 'all 0.2s ease',
        // Hover effects
        '&:hover': onClick && !disabled ? {
          transform: 'translateY(-1px)',
          boxShadow: 2,
          bgcolor: colorByDeclension 
            ? alpha(chipColor || '#000', 0.25)
            : 'action.hover',
        } : {},
        // Estado deshabilitado
        '&.Mui-disabled': {
          opacity: 0.6,
        }
      }}
    />
  );

  /**
   * ENVOLVER EN TOOLTIP SI ESTÁ HABILITADO
   */
  if (showTooltip && !disabled) {
    return (
      <Tooltip 
        title={tooltipContent}
        arrow
        placement="top"
        // enterDelay evita que aparezca muy rápido
        enterDelay={500}
      >
        {chipElement}
      </Tooltip>
    );
  }

  return chipElement;
};

// Exportar el componente
export default SelectedWordChip;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. CHIP COMPONENT:
 *    - Elemento compacto para mostrar información
 *    - Puede ser clickeable, eliminable, o solo visual
 *    - Avatar añade un icono o imagen al inicio
 * 
 * 2. EVENT HANDLING:
 *    - stopPropagation() previene bubbling
 *    - Separar handlers para diferentes acciones
 *    - Clicks en chip vs clicks en delete button
 * 
 * 3. CONDITIONAL WRAPPING:
 *    - Envolver condicionalmente en Tooltip
 *    - Evita duplicación de código
 *    - Mantiene el componente DRY (Don't Repeat Yourself)
 * 
 * 4. VARIANT PATTERN:
 *    - Diferentes modos de visualización
 *    - compact, default, detailed
 *    - Flexibilidad para diferentes contextos
 * 
 * 5. AVATAR IN CHIPS:
 *    - Añade elemento visual al inicio
 *    - Puede ser icono, imagen, o inicial
 *    - Mejora el reconocimiento visual
 * 
 * 6. COMPOSITION:
 *    - Componente pequeño y reutilizable
 *    - Se usa dentro de listas y otros componentes
 *    - Building block para UI más complejas
 */