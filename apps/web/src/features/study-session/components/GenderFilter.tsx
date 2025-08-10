/**
 * GENDER FILTER COMPONENT
 * 
 * Componente para filtrar palabras latinas por género gramatical.
 * Similar a DeclensionFilter pero para los tres géneros: masculino, femenino, neutro.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Radio Group vs Checkboxes: Este usa selección múltiple (como checkboxes)
 * - Visual Design: Usa iconos y colores para identificación rápida
 * - Accessibility: Incluye aria-labels para lectores de pantalla
 */

import React from 'react';
import {
  Box,
  Typography,
  ToggleButton,      // Botón que puede estar encendido/apagado
  ToggleButtonGroup,  // Grupo de ToggleButtons
  Stack,
  Paper,
  Chip,
  alpha,             // Función para transparencia de colores
} from '@mui/material';

// Iconos para representar géneros visualmente
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender'; // Para neutro
import FilterListIcon from '@mui/icons-material/FilterList';

// Importar el tipo Gender desde types
import type { Gender } from '../types';

// Importamos los colores centralizados del tema
// Usamos ruta relativa porque el alias @ no está configurado
import { LATIN_COLORS } from '../../../config/theme';

/**
 * CONFIGURACIÓN DE GÉNEROS
 * Información visual y descriptiva para cada género
 * Los colores ahora vienen del tema centralizado
 */
const genderConfig: Record<Gender, {
  label: string;
  icon: React.ReactNode;
  color: string;
  examples: string[];
  description: string;
}> = {
  masculine: {
    label: 'Masculino',
    icon: <MaleIcon />,
    color: LATIN_COLORS.genders.masculine, // Color desde tema centralizado
    examples: ['dominus', 'agricola', 'puer'],
    description: 'Sustantivos de género masculino'
  },
  feminine: {
    label: 'Femenino',
    icon: <FemaleIcon />,
    color: LATIN_COLORS.genders.feminine, // Color desde tema centralizado
    examples: ['rosa', 'puella', 'mater'],
    description: 'Sustantivos de género femenino'
  },
  neuter: {
    label: 'Neutro',
    icon: <TransgenderIcon />,
    color: LATIN_COLORS.genders.neuter, // Color desde tema centralizado
    examples: ['templum', 'bellum', 'corpus'],
    description: 'Sustantivos de género neutro'
  }
};

/**
 * PROPS DEL COMPONENTE
 */
interface GenderFilterProps {
  selectedGenders: Gender[];
  onChange: (genders: Gender[]) => void;
  disabled?: boolean;
  // Modo de visualización
  variant?: 'buttons' | 'chips';
  // Mostrar ejemplos de palabras
  showExamples?: boolean;
  // Tamaño de los controles
  size?: 'small' | 'medium' | 'large';
}

/**
 * COMPONENTE GENDER FILTER
 * 
 * Permite filtrar palabras por género gramatical.
 * Ofrece dos variantes visuales: botones toggle o chips.
 */
const GenderFilter: React.FC<GenderFilterProps> = ({
  selectedGenders,
  onChange,
  disabled = false,
  variant = 'buttons',
  showExamples = false,
  size = 'medium'
}) => {
  /**
   * MANEJADOR PARA TOGGLE BUTTON GROUP
   * El ToggleButtonGroup maneja arrays de valores directamente
   */
  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>, // Prefix with _ to indicate unused
    newGenders: Gender[]
  ) => {
    // newGenders puede ser null si se deseleccionan todos
    onChange(newGenders || []);
  };

  /**
   * MANEJADOR PARA CHIPS
   * Similar al DeclensionFilter
   */
  const handleChipClick = (gender: Gender) => {
    const currentSet = new Set(selectedGenders);
    
    if (currentSet.has(gender)) {
      currentSet.delete(gender);
    } else {
      currentSet.add(gender);
    }
    
    onChange(Array.from(currentSet));
  };

  /**
   * FUNCIONES HELPER
   */
  const selectAll = () => {
    onChange(['masculine', 'feminine', 'neuter']);
  };

  const clearAll = () => {
    onChange([]);
  };

  const isSelected = (gender: Gender): boolean => {
    return selectedGenders.includes(gender);
  };

  return (
    <Box>
      {/* ENCABEZADO */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Filtrar por Género
          </Typography>
        </Box>
        
        {/* CONTROLES RÁPIDOS */}
        <Stack direction="row" spacing={1}>
          <Chip
            label="Todos"
            size="small"
            onClick={selectAll}
            disabled={disabled}
            variant={selectedGenders.length === 3 ? "filled" : "outlined"}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="Ninguno"
            size="small"
            onClick={clearAll}
            disabled={disabled}
            variant={selectedGenders.length === 0 ? "filled" : "outlined"}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      </Box>

      {/* VARIANTE 1: TOGGLE BUTTONS */}
      {variant === 'buttons' && (
        <ToggleButtonGroup
          value={selectedGenders}
          onChange={handleToggleChange}
          aria-label="filtro de género"
          disabled={disabled}
          // Permitir selección múltiple
          // Sin esto, solo se podría seleccionar uno a la vez
          fullWidth
          size={size}
          sx={{ mb: 2 }}
        >
          {(Object.entries(genderConfig) as [Gender, typeof genderConfig[Gender]][]).map(
            ([gender, config]) => (
              <ToggleButton
                key={gender}
                value={gender}
                aria-label={config.label}
                sx={{
                  // Estilos condicionales basados en selección
                  bgcolor: isSelected(gender) 
                    ? alpha(config.color, 0.2) 
                    : 'transparent',
                  borderColor: isSelected(gender) 
                    ? config.color 
                    : 'divider',
                  color: isSelected(gender) 
                    ? config.color 
                    : 'text.primary',
                  // Animación al hacer hover
                  '&:hover': {
                    bgcolor: alpha(config.color, 0.1),
                    borderColor: config.color,
                  },
                  // Estado seleccionado
                  '&.Mui-selected': {
                    bgcolor: alpha(config.color, 0.3),
                    borderColor: config.color,
                    color: config.color,
                    '&:hover': {
                      bgcolor: alpha(config.color, 0.4),
                    }
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                >
                  {/* Icono del género */}
                  <Box sx={{ 
                    display: 'flex',
                    color: isSelected(gender) ? config.color : 'inherit' 
                  }}>
                    <>{config.icon}</>
                  </Box>
                  
                  {/* Etiqueta */}
                  <Typography 
                    variant={size === 'small' ? 'body2' : 'body1'}
                    sx={{ fontWeight: isSelected(gender) ? 'bold' : 'medium' }}
                  >
                    {config.label}
                  </Typography>
                </Stack>
              </ToggleButton>
            )
          )}
        </ToggleButtonGroup>
      )}

      {/* VARIANTE 2: CHIPS */}
      {variant === 'chips' && (
        <Stack 
          direction="row" 
          spacing={1.5}
          flexWrap="wrap"
          sx={{ gap: 1.5 }}
        >
          {(Object.entries(genderConfig) as [Gender, typeof genderConfig[Gender]][]).map(
            ([gender, config]) => {
              const selected = isSelected(gender);
              
              return (
                <Chip
                  key={gender}
                  label={config.label}
                  icon={config.icon as React.ReactElement}
                  onClick={() => handleChipClick(gender)}
                  disabled={disabled}
                  variant={selected ? 'filled' : 'outlined'}
                  size={size === 'large' ? 'medium' : size} // Chip doesn't support 'large'
                  sx={{
                    bgcolor: selected ? config.color : 'transparent',
                    borderColor: selected ? config.color : 'divider',
                    color: selected ? 'white' : 'text.primary',
                    '& .MuiChip-icon': {
                      color: selected ? 'white' : config.color,
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: selected 
                        ? config.color 
                        : alpha(config.color, 0.1),
                      borderColor: config.color,
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    }
                  }}
                />
              );
            }
          )}
        </Stack>
      )}

      {/* MOSTRAR EJEMPLOS (OPCIONAL) */}
      {showExamples && selectedGenders.length > 0 && (
        <Paper 
          sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Ejemplos de palabras:
          </Typography>
          <Stack spacing={1}>
            {selectedGenders.map(gender => (
              <Box key={gender}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: genderConfig[gender].color,
                    fontWeight: 'bold'
                  }}
                >
                  {genderConfig[gender].label}:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {genderConfig[gender].examples.join(', ')}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* CONTADOR DE SELECCIÓN */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {selectedGenders.length === 0 && 'No hay géneros seleccionados'}
          {selectedGenders.length === 1 && `1 género seleccionado: ${genderConfig[selectedGenders[0]].label}`}
          {selectedGenders.length === 2 && `2 géneros seleccionados`}
          {selectedGenders.length === 3 && 'Todos los géneros seleccionados'}
        </Typography>
      </Box>
    </Box>
  );
};

// Exportar el componente
export default GenderFilter;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. TOGGLE BUTTON GROUP:
 *    - Alternativa visual a checkboxes/radio buttons
 *    - Soporta selección simple o múltiple
 *    - Mejor para pocas opciones (2-5)
 * 
 * 2. ALPHA FUNCTION:
 *    - Crea versiones transparentes de colores
 *    - alpha(color, 0.5) = 50% transparencia
 *    - Útil para estados hover y fondos sutiles
 * 
 * 3. VARIANT PATTERN:
 *    - Un componente, múltiples presentaciones
 *    - Reutilización de lógica con diferentes UI
 *    - Flexibilidad para diferentes contextos
 * 
 * 4. ARIA LABELS:
 *    - aria-label para accesibilidad
 *    - Importante para lectores de pantalla
 *    - Mejora la experiencia para usuarios con discapacidades
 * 
 * 5. CONDITIONAL STYLING:
 *    - Estilos dinámicos basados en estado
 *    - Uso de operador ternario en sx prop
 *    - Transiciones para cambios suaves
 * 
 * 6. ICONS AS VISUAL AIDS:
 *    - Los iconos mejoran el reconocimiento rápido
 *    - Útiles para usuarios visuales
 *    - Refuerzan el significado del texto
 */