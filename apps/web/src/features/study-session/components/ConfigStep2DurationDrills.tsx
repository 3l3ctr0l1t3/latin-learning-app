/**
 * CONFIG STEP 2: DURATION AND DRILL TYPES
 * 
 * Segundo paso de la configuración de sesión de estudio.
 * Permite seleccionar duración y tipos de ejercicios.
 * 
 * OPTIMIZADO: Espaciado reducido para maximizar el uso del espacio vertical.
 */

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import DurationSelector from './DurationSelector';
import DrillTypeSelector from './DrillTypeSelector';
import type { DrillType, SessionDuration } from '../types';

/**
 * PROPS DEL COMPONENTE
 */
interface ConfigStep2DurationDrillsProps {
  // Duración actual seleccionada
  duration: SessionDuration;
  // Callback para cambio de duración
  onDurationChange: (duration: SessionDuration) => void;
  // Tipos de ejercicios seleccionados
  drillTypes: DrillType[];
  // Callback para cambio de tipos
  onDrillTypesChange: (types: DrillType[]) => void;
}

/**
 * COMPONENTE STEP 2: DURACIÓN Y EJERCICIOS
 * 
 * Versión optimizada con espaciado mínimo pero funcional.
 * Usa Stack para organización vertical con gaps controlados.
 */
const ConfigStep2DurationDrills: React.FC<ConfigStep2DurationDrillsProps> = ({
  duration,
  onDurationChange,
  drillTypes,
  onDrillTypesChange,
}) => {
  return (
    // Stack vertical con espaciado optimizado
    <Stack data-testid="config-step2-duration-drills" spacing={2}>  {/* Reducido de 3-4 a 2 para menos espacio */}
      {/* TÍTULO DEL PASO - Más compacto */}
      <Typography
        data-testid="step2-title"
        variant="h6"
        sx={{
          color: 'primary.main',
          fontWeight: 'medium',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },  // Tamaño reducido
          mb: 0  // Sin margen adicional
        }}
      >
        Paso 2: Duración y Ejercicios
      </Typography>

      {/* SECCIÓN DE DURACIÓN - Compacta */}
      <Box>
        {/* Selector de duración sin descripción extra para ahorrar espacio */}
        <DurationSelector
          value={duration}
          onChange={onDurationChange}
        />
      </Box>
      
      {/* SECCIÓN DE TIPOS DE EJERCICIOS - Compacta */}
      <Box>
        {/* DrillTypeSelector ya tiene su propia descripción interna */}
        <DrillTypeSelector
          value={drillTypes}
          onChange={onDrillTypesChange}
        />
      </Box>
    </Stack>
  );
};

export default ConfigStep2DurationDrills;