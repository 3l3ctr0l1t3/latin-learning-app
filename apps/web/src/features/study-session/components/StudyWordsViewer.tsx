/**
 * STUDY WORDS VIEWER COMPONENT
 * 
 * Permite al usuario revisar y estudiar las palabras seleccionadas
 * una por una antes de comenzar los ejercicios.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Estado del índice: Rastrea qué palabra se está mostrando
 * - Navegación: Permite moverse entre palabras
 * - Transición: Opción de continuar a ejercicios en cualquier momento
 * - Gestos: Soporte para swipe en móvil y drag en desktop
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack
} from '@mui/material';
import NavigationContainer from './NavigationContainer';
import WordNavigator from './WordNavigator';
import type { LatinWord } from './WordCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import SwipeIcon from '@mui/icons-material/Swipe';

/**
 * PROPS DEL COMPONENTE
 */
interface StudyWordsViewerProps {
  words: LatinWord[];                      // Lista de palabras a estudiar
  onContinueToExercises: () => void;       // Callback para continuar a ejercicios
  showTranslation?: boolean;               // Si mostrar traducción (default: true)
}

/**
 * COMPONENTE DE VISOR DE PALABRAS DE ESTUDIO
 * 
 * Muestra las palabras seleccionadas una por una para que el usuario
 * pueda estudiarlas antes de los ejercicios
 */
const StudyWordsViewer: React.FC<StudyWordsViewerProps> = ({
  words,
  onContinueToExercises,
  showTranslation = true
}) => {
  // Estado para rastrear el índice actual (para mostrar contador)
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Verificar si hay palabras
  if (words.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }} data-testid="study-words-viewer-empty-state">
        <Typography variant="h6" color="text.secondary" data-testid="text-no-words-selected">
          No hay palabras seleccionadas para estudiar
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      minHeight: {
        xs: 'calc(100vh - 180px)',  // Móvil: llenar pantalla completa menos headers/nav
        sm: '100%'  // Tablets y desktop: usar altura del contenedor
      }
    }} data-testid="study-words-viewer-container">
      {/* ENCABEZADO CON INFORMACIÓN */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }} data-testid="study-words-viewer-header">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          data-testid="header-stack"
        >
          {/* Título y contador */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} data-testid="title-and-counter-container">
            <SchoolIcon color="primary" data-testid="study-icon" />
            <Typography variant="h5" component="h2" data-testid="text-main-title">
              Estudiar Palabras
            </Typography>
            <Chip 
              label={`${currentIndex + 1} / ${words.length}`}
              size="small"
              color="primary"
              variant="outlined"
              icon={<SwipeIcon sx={{ fontSize: 16 }} data-testid="chip-swipe-icon" />}
              data-testid="chip-word-counter"
            />
          </Box>
        </Stack>
        
        {/* Texto explicativo */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2 }}
          data-testid="text-instructions"
        >
          Tómate tu tiempo para revisar cada palabra. 
          Puedes continuar a los ejercicios cuando te sientas listo.
        </Typography>
      </Box>
      
      {/* NAVEGADOR DE PALABRAS INTEGRADO */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} data-testid="word-navigator-section">
        <WordNavigator
          words={words}
          showTranslation={showTranslation}
          onWordChange={setCurrentIndex}
          showSwipeHint={true}
        />
      </Box>
      
      {/* BOTÓN CONTINUAR A EJERCICIOS - Al fondo en desktop */}
      <Box sx={{ 
        mt: { xs: 3, md: 'auto' },  // Auto margin-top en desktop lo empuja al fondo
        mb: { xs: 0, md: 2 },  // Pequeño margen inferior en desktop
        pt: { xs: 0, md: 2 },  // Padding superior en desktop para separación
        display: 'flex', 
        justifyContent: 'center' 
      }} data-testid="continue-button-section">
        <Button
          variant="outlined"
          size="large"
          startIcon={<PlayArrowIcon data-testid="button-continue-icon" />}
          onClick={onContinueToExercises}
          sx={{ 
            px: 4,
            py: 1.5,
            borderColor: 'primary.main',
            borderWidth: 2,
            color: 'primary.main',
            fontWeight: 'medium',
            fontSize: '1rem',
            backgroundColor: 'transparent',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              borderColor: 'primary.light',
              borderWidth: 2,
              backgroundColor: 'rgba(187, 134, 252, 0.08)',
              backdropFilter: 'blur(15px)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 20px rgba(187, 134, 252, 0.15)',
            },
            '&:active': {
              transform: 'translateY(0)',
              backdropFilter: 'blur(20px)',
            },
            transition: 'all 0.2s ease',
          }}
          data-testid="button-continue-to-exercises"
        >
          Continuar a Ejercicios
        </Button>
      </Box>
    </Box>
  );
};

export default StudyWordsViewer;