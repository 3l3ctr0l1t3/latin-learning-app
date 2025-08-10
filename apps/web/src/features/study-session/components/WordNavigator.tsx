/**
 * WORD NAVIGATOR COMPONENT
 * 
 * Componente que maneja la navegación entre palabras con:
 * - Visualización de tarjetas
 * - Puntos de navegación
 * - Soporte para swipe y teclado
 * - Animaciones de transición
 * 
 * CONCEPTOS IMPORTANTES:
 * - Componente reutilizable: Se puede usar en diferentes contextos
 * - Navegación circular: Del último al primero y viceversa
 * - Gestos múltiples: Touch, mouse y teclado
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fade,
  useMediaQuery,
  useTheme,
  Typography
} from '@mui/material';
import WordCard from './WordCard';
import type { LatinWord } from './WordCard';
import SwipeIcon from '@mui/icons-material/Swipe';

/**
 * PROPS DEL COMPONENTE
 */
interface WordNavigatorProps {
  words: LatinWord[];                      // Lista de palabras para navegar
  showTranslation?: boolean;               // Si mostrar traducción
  minimalCard?: boolean;                   // Usar versión minimal del WordCard
  compactCard?: boolean;                   // Usar versión compacta del WordCard
  onWordChange?: (index: number) => void;  // Callback cuando cambia la palabra
  showSwipeHint?: boolean;                 // Mostrar hint de swipe
}

/**
 * COMPONENTE DE NAVEGADOR DE PALABRAS
 * 
 * Maneja toda la lógica de navegación y visualización de palabras
 */
const WordNavigator: React.FC<WordNavigatorProps> = ({
  words,
  showTranslation = true,
  minimalCard = false,
  compactCard = false,
  onWordChange,
  showSwipeHint = true
}) => {
  // Estado para el índice actual
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Estado para animación
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Referencias para gestos
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  
  // Detectar tamaño de pantalla
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // Palabra actual
  const currentWord = words[currentIndex];
  
  // Notificar cambio de palabra
  useEffect(() => {
    if (onWordChange) {
      onWordChange(currentIndex);
    }
  }, [currentIndex, onWordChange]);
  
  /**
   * NAVEGACIÓN CIRCULAR CON ANIMACIÓN
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
   * GESTOS TÁCTILES
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };
  
  /**
   * GESTOS DE MOUSE
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    e.preventDefault();
  };
  
  const handleMouseMove = (_e: React.MouseEvent) => {
    if (!isDragging.current) return;
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeThreshold = 50;
    const diff = dragStartX.current - e.clientX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };
  
  const handleMouseLeave = () => {
    isDragging.current = false;
  };
  
  /**
   * NAVEGACIÓN CON TECLADO
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
  
  if (words.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }} data-testid="word-navigator-empty-state">
        <Typography variant="h6" color="text.secondary" data-testid="text-no-words-message">
          No hay palabras para mostrar
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%' }} data-testid="word-navigator-container">
      {/* CONTENEDOR DE TARJETA CON GESTOS */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          mb: 2  // Espacio reducido antes de los dots
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        data-testid="word-card-gesture-container"
      >
        <Box
          sx={{
            cursor: isMediumUp ? 'grab' : 'default',
            '&:active': {
              cursor: isMediumUp ? 'grabbing' : 'default'
            },
            userSelect: 'none',
            transition: isAnimating ? 'transform 0.15s ease-out' : 'none',
            transform: isAnimating
              ? `translateX(${slideDirection === 'left' ? '-20px' : '20px'})`
              : 'translateX(0)'
          }}
          data-testid="word-card-animation-wrapper"
        >
          <Fade in={!isAnimating} timeout={150}>
            <Box data-testid="word-card-fade-container">
              <WordCard
                word={currentWord}
                showTranslation={showTranslation}
                minimal={minimalCard}
                compact={compactCard}
              />
            </Box>
          </Fade>
        </Box>
        
        {/* HINT DE SWIPE (solo en primera palabra) */}
        {showSwipeHint && currentIndex === 0 && (
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
      
      {/* PUNTOS DE NAVEGACIÓN */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0.5,
          flexWrap: 'wrap',
          px: 2
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
  );
};

export default WordNavigator;