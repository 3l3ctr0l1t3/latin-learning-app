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

/**
 * Props Interface
 * 
 * Props are like function parameters - they're how parent components
 * pass data DOWN to child components. This is "one-way data flow".
 * 
 * In Java terms: Props are like constructor parameters or method arguments
 */
interface DurationSelectorProps {
  // Current selected value
  value: 5 | 10 | 15;
  
  // Callback function that fires when user selects a duration
  // The parent component passes this function down
  onChange: (duration: 5 | 10 | 15) => void;
  
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
    event: React.MouseEvent<HTMLElement>,
    newDuration: 5 | 10 | 15 | null,
  ) => {
    // Only call onChange if we have a valid new value
    if (newDuration !== null) {
      onChange(newDuration);
    }
  };
  
  return (
    <Box>
      {/* Label with icon */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <TimerIcon color="primary" />
        <Typography variant="subtitle1" fontWeight="medium">
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
      >
        <ToggleButton value={5}>
          <Stack spacing={0.5}>
            <Typography variant="h6">5</Typography>
            <Typography variant="caption">minutos</Typography>
          </Stack>
        </ToggleButton>
        
        <ToggleButton value={10}>
          <Stack spacing={0.5}>
            <Typography variant="h6">10</Typography>
            <Typography variant="caption">minutos</Typography>
          </Stack>
        </ToggleButton>
        
        <ToggleButton value={15}>
          <Stack spacing={0.5}>
            <Typography variant="h6">15</Typography>
            <Typography variant="caption">minutos</Typography>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
      
      {/* Helper text */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Sesiones más cortas son mejores para mantener la concentración
      </Typography>
    </Box>
  );
};

export default DurationSelector;