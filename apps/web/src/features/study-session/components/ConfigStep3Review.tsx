/**
 * CONFIG STEP 3: REVIEW AND START
 * 
 * Tercer paso de la configuración - Revisión final.
 * Muestra un resumen de la configuración antes de comenzar.
 * 
 * OPTIMIZADO: Layout compacto con scroll para las palabras.
 */

import React from 'react';
import { Box, Typography, Stack, Chip, Button, Paper } from '@mui/material';
import SelectedWordChip from './SelectedWordChip';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { LatinWord } from './WordCard';
import type { DrillType, SessionDuration } from '../types';

/**
 * PROPS DEL COMPONENTE
 */
interface ConfigStep3ReviewProps {
  // Configuración a revisar
  selectedWords: LatinWord[];
  duration: SessionDuration;
  drillTypes: DrillType[];
  // Callback para comenzar la sesión
  onStartSession: () => void;
}

/**
 * COMPONENTE STEP 3: REVISIÓN
 * 
 * Muestra un resumen compacto de toda la configuración.
 * Optimizado para usar el mínimo espacio vertical.
 */
const ConfigStep3Review: React.FC<ConfigStep3ReviewProps> = ({
  selectedWords,
  duration,
  drillTypes,
  onStartSession,
}) => {
  /**
   * Mapeo de tipos de ejercicios a labels en español
   */
  const drillTypeLabels: Record<DrillType, string> = {
    multipleChoice: 'Opción Múltiple',
    fillInBlank: 'Completar Espacios',
    directInput: 'Entrada Directa',
    flashcards: 'Tarjetas',
  };

  return (
    <Stack spacing={2} data-testid="config-step3-review">  {/* Espaciado reducido */}
      {/* TÍTULO DEL PASO */}
      <Typography 
        variant="h6" 
        data-testid="config-step3-review-header"
        sx={{ 
          color: 'primary.main',
          fontWeight: 'medium',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          mb: 0
        }}
      >
        Paso 3: Revisa tu configuración
      </Typography>
      
      {/* GRID DE RESUMEN - Más compacto */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 2
      }}
      data-testid="config-step3-review-summary-grid">
        {/* PALABRAS SELECCIONADAS - Con scroll */}
        <Paper sx={{ 
          p: 1.5,  // Padding reducido
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider'
        }}
        data-testid="config-step3-review-words-section">
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }} data-testid="config-step3-review-words-header">
            Palabras ({selectedWords.length})
          </Typography>
          <Box sx={{ 
            maxHeight: { 
              xs: 200,  // Móvil: ~4-6 líneas de chips
              sm: 120   // Desktop: mantener compacto
            },
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5  // Gap mínimo entre chips
          }}
          data-testid="config-step3-review-words-list">
            {selectedWords.map((word, index) => (
              <SelectedWordChip
                key={word.id}
                word={word}
                variant="compact"
                size="small"  // Tamaño pequeño
                showTooltip={true}
                colorByDeclension={true}
                data-testid={`config-step3-review-word-chip-${index}`}
              />
            ))}
          </Box>
        </Paper>
        
        {/* DURACIÓN Y EJERCICIOS */}
        <Stack spacing={1.5} data-testid="config-step3-review-settings-section">
          {/* Duración */}
          <Paper sx={{ 
            p: 1.5,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
          data-testid="config-step3-review-duration-section">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }} data-testid="config-step3-review-duration-header">
              Duración
            </Typography>
            <Chip 
              label={`${duration} minutos`}
              color="primary"
              size="medium"
              data-testid="config-step3-review-duration-chip"
            />
          </Paper>
          
          {/* Tipos de ejercicios */}
          <Paper sx={{ 
            p: 1.5,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
          data-testid="config-step3-review-drills-section">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }} data-testid="config-step3-review-drills-header">
              Ejercicios
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} data-testid="config-step3-review-drills-list">
              {drillTypes.map((type, index) => (
                <Chip
                  key={type}
                  label={drillTypeLabels[type] || type}
                  color="secondary"
                  size="small"
                  data-testid={`config-step3-review-drill-chip-${index}`}
                />
              ))}
            </Box>
          </Paper>
        </Stack>
      </Box>
      
      {/* BOTÓN PARA COMENZAR - Más prominente */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        startIcon={<RocketLaunchIcon />}
        onClick={onStartSession}
        data-testid="config-step3-review-start-button"
        sx={{ 
          mt: 1,  // Margen superior mínimo
          py: 1.5,  // Padding vertical
          fontSize: { xs: '1rem', sm: '1.1rem' },
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #9965F4 30%, #00A896 90%)',
          }
        }}
      >
        Comenzar Sesión de Estudio
      </Button>
    </Stack>
  );
};

export default ConfigStep3Review;