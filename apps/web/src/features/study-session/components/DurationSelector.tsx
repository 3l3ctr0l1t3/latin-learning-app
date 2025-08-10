/**
 * DURATION SELECTOR COMPONENT
 * 
 * A SINGLE-RESPONSIBILITY component that ONLY handles duration selection.
 * This is a "dumb" or "presentational" component - it doesn't manage state,
 * it just displays options and reports user choices up to its parent.
 * 
 * In component-oriented design:
 * - Each component does ONE thing well
 * - Components are reusable
 * - Components don't know about the larger context
 */

import React from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,  // Group of buttons where only one can be selected
  ToggleButton,       // Individual toggle button
  Stack,
} from '@mui/material';
import {
  Timer as TimerIcon,
} from '@mui/icons-material';

// Importar el tipo SessionDuration desde nuestro archivo de tipos centralizado
// Esto asegura consistencia en toda la aplicación
import type { SessionDuration } from '../types';

/**
 * Props Interface
 * 
 * Props are like function parameters - they're how parent components
 * pass data DOWN to child components. This is "one-way data flow".
 * 
 * In Java terms: Props are like constructor parameters or method arguments
 */
interface DurationSelectorProps {
  // Current selected value - usando el tipo importado
  value: SessionDuration;
  
  // Callback function that fires when user selects a duration
  // The parent component passes this function down
  onChange: (duration: SessionDuration) => void;
  
  // Optional: disable the entire component
  disabled?: boolean;
}

/**
 * DurationSelector Component
 * 
 * This component is "controlled" - the parent controls its state.
 * It doesn't store its own state, just displays what it's told
 * and reports changes back up.
 */
const DurationSelector: React.FC<DurationSelectorProps> = ({
  value,      // Current value from parent
  onChange,   // Function to call when value changes
  disabled = false,  // Default value if not provided
}) => {
  /**
   * Handle duration change
   * 
   * This function is called when user clicks a button.
   * We receive the new value and pass it up to the parent.
   */
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>, // Prefix with _ to indicate unused
    newDuration: 5 | 10 | 15 | null,
  ) => {
    // Only call onChange if we have a valid new value
    if (newDuration !== null) {
      onChange(newDuration);
    }
  };
  
  return (
    <Box data-testid="duration-selector">
      {/* Label with icon */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }} data-testid="duration-selector-header">
        <TimerIcon color="primary" data-testid="duration-selector-icon" />
        <Typography variant="subtitle1" fontWeight="medium" data-testid="duration-selector-title">
          Duración de la sesión
        </Typography>
      </Stack>
      
      {/* Toggle buttons for duration selection */}
      {/* ToggleButtonGroup ensures only one button can be selected at a time */}
      <ToggleButtonGroup
        value={value}
        exclusive  // Only one can be selected
        onChange={handleChange}
        disabled={disabled}
        fullWidth  // Buttons stretch to fill container
        color="primary"
        orientation="horizontal" // Mantener horizontal en todos los tamaños
        data-testid="duration-selector-group"
        sx={{
          '& .MuiToggleButton-root': {
            // Hacer los botones más pequeños en móvil
            px: { xs: 1, sm: 2 }, // padding horizontal responsivo
            py: { xs: 0.5, sm: 1 }, // padding vertical responsivo
          }
        }}
      >
        <ToggleButton value={5} data-testid="duration-selector-button-5">
          <Stack spacing={0.5}>
            <Typography variant="h6" data-testid="duration-selector-5-number">5</Typography>
            <Typography variant="caption" data-testid="duration-selector-5-label">minutos</Typography>
          </Stack>
        </ToggleButton>
        
        <ToggleButton value={10} data-testid="duration-selector-button-10">
          <Stack spacing={0.5}>
            <Typography variant="h6" data-testid="duration-selector-10-number">10</Typography>
            <Typography variant="caption" data-testid="duration-selector-10-label">minutos</Typography>
          </Stack>
        </ToggleButton>
        
        <ToggleButton value={15} data-testid="duration-selector-button-15">
          <Stack spacing={0.5}>
            <Typography variant="h6" data-testid="duration-selector-15-number">15</Typography>
            <Typography variant="caption" data-testid="duration-selector-15-label">minutos</Typography>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default DurationSelector;