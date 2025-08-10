/**
 * MULTIPLE CHOICE DECLENSION DRILL CARD
 * 
 * Versión del ejercicio de declinación que usa BaseDrillCard
 * para mantener consistencia visual con otros ejercicios.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Composición: Usa BaseDrillCard como contenedor
 * - Consistencia: Mismo tamaño y estilo que otros drills
 * - Responsivo: Adaptado para móvil sin scroll
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import type { LatinWord } from '../WordCard';
import BaseDrillCard from './BaseDrillCard';

/**
 * PROPS DEL COMPONENTE
 */
interface MultipleChoiceDeclensionCardProps {
  // Palabra para el ejercicio
  currentWord: LatinWord;
  
  // Callback cuando el usuario responde
  onAnswer: (isCorrect: boolean) => void;
  
  // Mostrar etiquetas en los botones
  showLabels?: boolean;
  
  // Versión compacta para móvil
  compact?: boolean;
}

/**
 * INFORMACIÓN SOBRE LAS DECLINACIONES (versión compacta)
 * Usa el nuevo sistema de colores armonizado
 */
const DECLENSION_INFO = {
  '1st': {
    label: '1ª',
    fullLabel: '1ª Declinación',
    color: '#A78BFA',  // Violeta - Análogo al púrpura principal
    hint: '-ae',
    example: 'rosa'
  },
  '2nd': {
    label: '2ª',
    fullLabel: '2ª Declinación', 
    color: '#818CF8',  // Índigo - Transición desde violeta
    hint: '-i',
    example: 'dominus'
  },
  '3rd': {
    label: '3ª',
    fullLabel: '3ª Declinación',
    color: '#22D3EE',  // Cyan - Color puente vibrante
    hint: '-is',
    example: 'rex'
  },
  '4th': {
    label: '4ª',
    fullLabel: '4ª Declinación',
    color: '#FBD38D',  // Ámbar - Conecta con secundario
    hint: '-us',
    example: 'manus'
  },
  '5th': {
    label: '5ª',
    fullLabel: '5ª Declinación',
    color: '#FDA4AF',  // Rosa Coral - Complementario cálido
    hint: '-ei',
    example: 'dies'
  }
};

/**
 * COMPONENTE PRINCIPAL
 */
const MultipleChoiceDeclensionCard: React.FC<MultipleChoiceDeclensionCardProps> = ({
  currentWord,
  onAnswer,
  showLabels = true,
  compact = false
}) => {
  // Estado del ejercicio
  const [selectedDeclension, setSelectedDeclension] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Hooks para responsividad
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isCompact = compact || isMobile;
  
  // Respuesta correcta
  const correctDeclension = currentWord.declension;
  
  // Opciones disponibles
  const declensionOptions = ['1st', '2nd', '3rd', '4th', '5th'] as const;
  
  /**
   * MANEJAR SELECCIÓN
   */
  const handleSelectDeclension = (declension: string) => {
    if (hasAnswered) return;
    
    setSelectedDeclension(declension);
    const correct = declension === correctDeclension;
    setIsCorrect(correct);
    setHasAnswered(true);
    onAnswer(correct);
  };
  
  /**
   * RESETEAR CUANDO CAMBIA LA PALABRA
   */
  useEffect(() => {
    setSelectedDeclension(null);
    setHasAnswered(false);
    setIsCorrect(false);
  }, [currentWord.id]);
  
  /**
   * OBTENER COLOR DE BOTÓN
   */
  const getButtonColor = (declension: string) => {
    if (!hasAnswered) {
      return DECLENSION_INFO[declension as keyof typeof DECLENSION_INFO].color;
    }
    
    if (declension === correctDeclension) {
      return '#4CAF50';
    }
    
    if (declension === selectedDeclension && !isCorrect) {
      return '#F44336';
    }
    
    return '#666666';
  };
  
  /**
   * CONTENIDO DEL EJERCICIO
   */
  const exerciseContent = (
    <Box>
      {/* PALABRA A IDENTIFICAR */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: isCompact ? 2 : 3,
          px: 2,
          bgcolor: 'background.default',
          borderRadius: 2,
          mb: isCompact ? 2 : 3
        }}
      >
        {/* Nominativo */}
        <Typography 
          variant={isCompact ? "h4" : "h3"}
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 0.5
          }}
        >
          {currentWord.nominative}
        </Typography>
        
        {/* Genitivo */}
        <Typography 
          variant={isCompact ? "h6" : "h5"}
          sx={{ 
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          {currentWord.genitive}
        </Typography>
        
        {/* Género (solo si showLabels) */}
        {showLabels && (
          <Chip
            label={
              currentWord.gender === 'masculine' ? 'm.' :
              currentWord.gender === 'feminine' ? 'f.' :
              'n.'
            }
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>
      
      {/* OPCIONES EN GRID PARA MÓVIL */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: isCompact ? 'repeat(5, 1fr)' : 'repeat(5, 1fr)',
        gap: isCompact ? 1 : 1.5
      }}>
        {declensionOptions.map((declension) => {
          const info = DECLENSION_INFO[declension];
          const buttonColor = getButtonColor(declension);
          const isSelected = selectedDeclension === declension;
          const isCorrectAnswer = declension === correctDeclension;
          
          return (
            <Button
              key={declension}
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => handleSelectDeclension(declension)}
              disabled={hasAnswered}
              sx={{
                minWidth: isCompact ? 50 : 80,
                height: isCompact ? 60 : 80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: isCompact ? 0.5 : 1,
                borderColor: buttonColor,
                borderWidth: 2,
                color: isSelected || (hasAnswered && isCorrectAnswer) ? '#fff' : buttonColor,
                bgcolor: isSelected || (hasAnswered && isCorrectAnswer) 
                  ? buttonColor 
                  : 'transparent',
                '&:hover': {
                  borderColor: buttonColor,
                  borderWidth: 2,
                  bgcolor: isSelected || (hasAnswered && isCorrectAnswer)
                    ? buttonColor
                    : alpha(buttonColor, 0.1)
                },
                '&.Mui-disabled': {
                  borderColor: hasAnswered ? buttonColor : '#666',
                  borderWidth: hasAnswered && (isSelected || isCorrectAnswer) ? 2 : 1,
                  color: hasAnswered && (isSelected || isCorrectAnswer) ? '#fff' : '#666',
                  bgcolor: hasAnswered && (isSelected || isCorrectAnswer) 
                    ? buttonColor 
                    : 'transparent',
                  opacity: hasAnswered && (isSelected || isCorrectAnswer) ? 1 : 0.6
                }
              }}
              data-testid={`declension-option-${declension}`}
            >
              {/* Icono de resultado */}
              {hasAnswered && isCorrectAnswer && (
                <CheckCircleIcon sx={{ fontSize: isCompact ? 16 : 20, mb: 0.5 }} />
              )}
              {hasAnswered && isSelected && !isCorrect && (
                <CancelIcon sx={{ fontSize: isCompact ? 16 : 20, mb: 0.5 }} />
              )}
              
              {/* Número de declinación */}
              <Typography 
                variant={isCompact ? "body1" : "h6"}
                sx={{ fontWeight: 'bold', lineHeight: 1 }}
              >
                {info.label}
              </Typography>
              
              {/* Terminación característica */}
              {showLabels && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: isCompact ? '0.65rem' : '0.75rem',
                    opacity: 0.8,
                    lineHeight: 1
                  }}
                >
                  {info.hint}
                </Typography>
              )}
            </Button>
          );
        })}
      </Box>
      
      {/* EXPLICACIÓN (solo después de responder) */}
      {hasAnswered && showLabels && (
        <Box 
          sx={{ 
            mt: 2,
            p: isCompact ? 1.5 : 2,
            borderRadius: 1,
            bgcolor: alpha(isCorrect ? '#4CAF50' : '#F44336', 0.1),
            border: 1,
            borderColor: isCorrect ? '#4CAF50' : '#F44336'
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {currentWord.nominative} → {DECLENSION_INFO[correctDeclension].fullLabel}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Genitivo en {DECLENSION_INFO[correctDeclension].hint} 
            (ej: {DECLENSION_INFO[correctDeclension].example})
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  /**
   * RENDER CON BASEDRILL CARD
   */
  return (
    <BaseDrillCard
      icon={<SchoolIcon color="primary" />}
      exerciseType="Declinación"
      title="Identifica la Declinación"
      subtitle="¿A qué declinación pertenece esta palabra?"
      isAnswered={hasAnswered}
      isCorrect={isCorrect}
      compact={isCompact}
      exerciseContent={exerciseContent}
      feedbackContent={
        hasAnswered && !showLabels && (
          <Typography variant="caption">
            {currentWord.nominative} → {DECLENSION_INFO[correctDeclension].fullLabel}
          </Typography>
        )
      }
    />
  );
};

export default MultipleChoiceDeclensionCard;

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. CONSISTENCIA:
 *    - Usa BaseDrillCard como todos los otros ejercicios
 *    - Mantiene el mismo tamaño y estilo
 * 
 * 2. RESPONSIVE:
 *    - Grid de 5 columnas para las opciones
 *    - Tamaños reducidos en móvil
 *    - Sin scroll necesario
 * 
 * 3. OPTIMIZACIÓN MÓVIL:
 *    - Botones más pequeños pero tocables
 *    - Menos texto en pantallas pequeñas
 *    - Explicación compacta
 */