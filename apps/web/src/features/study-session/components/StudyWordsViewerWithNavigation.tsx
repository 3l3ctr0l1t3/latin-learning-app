/**
 * STUDY WORDS VIEWER WITH NAVIGATION COMPONENT
 * 
 * Versión mejorada del StudyWordsViewer que incluye flechas de navegación
 * laterales en pantallas sm-xl, sin afectar el layout móvil (xs).
 * 
 * CONCEPTOS IMPORTANTES:
 * - Navegación múltiple: Soporta swipe, teclado y botones de flecha
 * - Responsive: Las flechas aparecen en sm y superiores, ocultas solo en xs (móvil)
 * - Layout optimizado: En móvil usa toda la pantalla sin wrapping adicional
 * - WordNavigator integrado: Todas las funcionalidades de navegación incluidas directamente
 * - Gestos táctiles: Soporte completo para swipe en móvil y drag en desktop
 * - Animaciones: Transiciones suaves entre palabras con fade effects
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import WordCard from '../../../components/global/WordCard';
import type { LatinWord } from '../../../components/global/WordCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import SwipeIcon from '@mui/icons-material/Swipe';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * PROPS DEL COMPONENTE
 */
interface StudyWordsViewerWithNavigationProps {
  words: LatinWord[];                      // Lista de palabras a estudiar
  onContinueToExercises: () => void;       // Callback para continuar a ejercicios
  showTranslation?: boolean;               // Si mostrar traducción (default: true)
}

/**
 * COMPONENTE DE VISOR DE PALABRAS CON NAVEGACIÓN MEJORADA
 * 
 * Incluye toda la funcionalidad de WordNavigator integrada directamente:
 * - Flechas de navegación en pantallas sm y superiores (ocultas solo en xs)
 * - Gestos de swipe para móvil y drag para desktop
 * - Navegación con teclado (flechas izquierda/derecha)
 * - Indicadores de puntos (dots) para mostrar posición actual
 * - Animaciones suaves entre transiciones
 */
const StudyWordsViewerWithNavigation: React.FC<StudyWordsViewerWithNavigationProps> = ({
  words,
  onContinueToExercises,
  showTranslation = true
}) => {
  // Estados para navegación de palabras (extraídos de WordNavigator)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Referencias para gestos táctiles y de mouse (extraídas de WordNavigator)
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  
  // Detectar tamaño de pantalla
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up('sm')); // Cambiado de md a sm
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // Palabra actual
  const currentWord = words[currentIndex];
  
  /**
   * NAVEGACIÓN CIRCULAR CON ANIMACIÓN (extraída de WordNavigator)
   * 
   * Maneja la navegación entre palabras con:
   * - Navegación circular (del último al primero y viceversa)
   * - Animaciones de transición suaves
   * - Control de dirección de la animación
   */
  const navigateToWord = (newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    let targetIndex = newIndex;
    if (newIndex < 0) {
      targetIndex = words.length - 1;
    } else if (newIndex >= words.length) {
      targetIndex = 0;
    }
    
    setIsAnimating(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      setCurrentIndex(targetIndex);
      setIsAnimating(false);
    }, 150);
  };
  
  const handlePrevious = () => {
    const newIndex = currentIndex - 1;
    const targetIndex = newIndex < 0 ? words.length - 1 : newIndex;
    navigateToWord(targetIndex, 'right');
  };
  
  const handleNext = () => {
    const newIndex = currentIndex + 1;
    const targetIndex = newIndex >= words.length ? 0 : newIndex;
    navigateToWord(targetIndex, 'left');
  };
  
  /**
   * GESTOS TÁCTILES (extraídos de WordNavigator)
   * 
   * Maneja los gestos de swipe en dispositivos táctiles:
   * - Detecta el inicio del toque y la posición
   * - Rastrea el movimiento del dedo
   * - Determina la dirección del swipe al finalizar
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Mínima distancia para considerar un swipe
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext(); // Swipe hacia la izquierda = siguiente
      } else {
        handlePrevious(); // Swipe hacia la derecha = anterior
      }
    }
  };
  
  /**
   * GESTOS DE MOUSE (extraídos de WordNavigator)
   * 
   * Maneja los gestos de drag con mouse en desktop:
   * - Detecta cuando se presiona el botón del mouse
   * - Rastrea el movimiento del mouse mientras se arrastra
   * - Determina la dirección del drag al soltar
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    e.preventDefault();
  };
  
  const handleMouseMove = (_e: React.MouseEvent) => {
    if (!isDragging.current) return;
    // Aquí se podría agregar retroalimentación visual del drag
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeThreshold = 50; // Mínima distancia para considerar un drag
    const diff = dragStartX.current - e.clientX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext(); // Drag hacia la izquierda = siguiente
      } else {
        handlePrevious(); // Drag hacia la derecha = anterior
      }
    }
  };
  
  const handleMouseLeave = () => {
    isDragging.current = false;
  };
  
  /**
   * NAVEGACIÓN CON TECLADO (extraída de WordNavigator)
   * 
   * Permite navegar con las flechas del teclado en desktop:
   * - Flecha izquierda: palabra anterior
   * - Flecha derecha: palabra siguiente
   * - Solo activo en pantallas medianas y superiores
   */
  useEffect(() => {
    if (!isMediumUp) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, isMediumUp]);
  
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
      maxHeight: '100vh',  // Prevenir que crezca más allá de la ventana
      // Paddings removidos - sin espaciado interno
      overflow: 'hidden'  // Prevenir scroll en el contenedor principal
    }} data-testid="study-words-viewer-container">
      
      {/* ENCABEZADO CON INFORMACIÓN */}
      <Box sx={{ mb: { xs: 1, sm: 3 } }} data-testid="study-words-viewer-header">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={{ xs: 1, sm: 2 }}
          data-testid="header-stack"
        >
          {/* Título y contador */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap'  // Permite que los elementos se envuelvan en pantallas muy pequeñas
          }} data-testid="title-and-counter-container">
            <SchoolIcon color="primary" data-testid="study-icon" />
            <Typography 
              variant="h5"  // Tamaño fijo, ajustaremos con sx
              component="h2" 
              data-testid="text-main-title"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' }  // Texto más pequeño en móvil
              }}
            >
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
        
        {/* Texto explicativo - visible en todas las pantallas */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mt: 2
          }}
          data-testid="text-instructions"
        >
          Tómate tu tiempo para revisar cada palabra. 
          Puedes continuar a los ejercicios cuando te sientas listo.
        </Typography>
      </Box>
      
      {/* CONTENEDOR DE NAVEGACIÓN CON FLECHAS Y FUNCIONALIDAD INTEGRADA */}
      <Box sx={{ 
        flex: '1 1 auto',  // Toma espacio disponible pero no fuerza crecimiento
        display: 'flex',
        flexDirection: 'column',
        mt: {xs: 5, sm: 0},
        minHeight: 0,  // Permite que el flex se contraiga si es necesario
        overflow: 'visible'  // Permite que los dots sean visibles
      }} data-testid="word-navigator-with-arrows">
        
        {/* NAVEGADOR DE PALABRAS CENTRAL CON FUNCIONALIDAD INTEGRADA */}
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,  // Espacio entre la tarjeta y los dots
          alignItems: 'center'  // Centrar el contenido
        }} data-testid="word-navigator-section">
          
          {/* CONTENEDOR DE TARJETA CON GESTOS, ANIMACIÓN Y FLECHAS */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'visible',  // Permite efectos hover
              mt: { xs: 0.3, sm: 0.5, md: 1 },  // Margen superior para dar espacio al efecto hover
              pt: { xs: 1, sm: 2 },  // Padding superior adicional para el efecto hover
              px: { xs: 1, sm: 2 },  // Padding horizontal para evitar corte de sombras
              // Ancho fijo para evitar variaciones - ajustado para diferentes tamaños de pantalla
              width: { 
                xs: '100%',      // Móvil: usa todo el ancho disponible
                sm: '500px',     // Tablets pequeñas: 500px
                md: '550px',     // Desktop mediano: 550px
                lg: '600px',     // Desktop grande: 600px
                xl: '650px'      // Desktop extra grande: 650px
              },
              maxWidth: '100%',  // Nunca exceder el ancho del contenedor padre
              margin: '0 auto',  // Centrar horizontalmente
              cursor: isMediumUp ? 'grab' : 'default',
              '&:active': {
                cursor: isMediumUp ? 'grabbing' : 'default'
              },
              userSelect: 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            data-testid="word-card-container"
          >
            <Box position="relative">
              {/* CONTENEDOR PARA LA ANIMACIÓN DE LA TARJETA SOLAMENTE */}
              <Box
                sx={{
                  transition: isAnimating ? 'transform 0.15s ease-out' : 'none',
                  transform: isAnimating
                    ? `translateX(${slideDirection === 'left' ? '-20px' : '20px'})`
                    : 'translateX(0)'
                }}
              >
                <Fade in={!isAnimating} timeout={150}>
                  <Box>
                    <WordCard
                      word={currentWord}
                      showTranslation={showTranslation}
                      minimal={true}
                      compact={false}
                    />
                  </Box>
                </Fade>
              </Box>
              
              {/* FLECHA IZQUIERDA - FUERA DE LA ANIMACIÓN (Solo en sm+, oculta en xs) */}
              {isSmallUp && (
                <IconButton
                    onClick={handlePrevious}
                    disabled={words.length <= 1}
                    sx={{
                      position: 'absolute',
                      left: -60,  // Fuera del card pero cerca
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      opacity: words.length <= 1 ? 0.3 : 0.8,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: words.length <= 1 ? 0.3 : 1,
                        bgcolor: 'action.hover'
                      }
                    }}
                    data-testid="card-navigation-previous"
                    aria-label="Palabra anterior"
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
              )}
              
              {/* FLECHA DERECHA - FUERA DE LA ANIMACIÓN (Solo en sm+, oculta en xs) */}
              {isSmallUp && (
                <IconButton
                  onClick={handleNext}
                  disabled={words.length <= 1}
                  sx={{
                    position: 'absolute',
                    right: -60,  // Fuera del card pero cerca
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    opacity: words.length <= 1 ? 0.3 : 0.8,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      opacity: words.length <= 1 ? 0.3 : 1,
                      bgcolor: 'action.hover'
                    }
                  }}
                  data-testid="card-navigation-next"
                  aria-label="Palabra siguiente"
                >
                  <NavigateNextIcon />
                </IconButton>
              )}
            </Box>
            
            {/* HINT DE SWIPE (solo en primera palabra) */}
            {currentIndex === 0 && (
              <Fade in timeout={1000}>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.secondary',
                    opacity: 0.5,
                    pointerEvents: 'none'
                  }}
                  data-testid="swipe-hint-container"
                >
                  <SwipeIcon sx={{ fontSize: 20 }} data-testid="swipe-hint-icon" />
                  <Typography variant="caption" data-testid="text-swipe-hint">
                    Desliza para navegar
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* PUNTOS DE NAVEGACIÓN (funcionalidad de WordNavigator) */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 0.5,
              flexWrap: 'wrap',
              px: 2,
              // mt removido - sin margen superior
              minHeight: 10  // Altura mínima para asegurar visibilidad
            }}
            data-testid="navigation-dots-container"
          >
            {words.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  const direction = index > currentIndex ? 'left' : 'right';
                  navigateToWord(index, direction);
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? 'primary.main' : 'action.disabled',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.5)',
                    bgcolor: index === currentIndex ? 'primary.main' : 'action.hover'
                  }
                }}
                data-testid={`navigation-dot-${index}`}
                aria-label={`Navegar a palabra ${index + 1}`}
              />
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* BOTÓN CONTINUAR A EJERCICIOS */}
      <Box sx={{ 
        mt: { xs: 2, sm: 3 },
        // mb removido - sin margen inferior para que el botón esté más cerca del final
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0  // No permite que el botón se encoja
      }} data-testid="continue-button-section">
        <Button
          variant="outlined"
          size="large"  // Tamaño fijo - usaremos sx para ajustar el tamaño responsivo
          startIcon={<PlayArrowIcon data-testid="button-continue-icon" />}
          onClick={onContinueToExercises}
          sx={{ 
            px: { xs: 2.5, sm: 3, md: 4 },   // Menos padding en móvil
            py: { xs: 0.8, sm: 1, md: 1.5 }, // Menos padding vertical en móvil
            borderColor: 'primary.main',
            borderWidth: 2,
            color: 'primary.main',
            fontWeight: 'medium',
            fontSize: { xs: '0.9rem', sm: '1rem' },  // Texto más pequeño en móvil
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

export default StudyWordsViewerWithNavigation;