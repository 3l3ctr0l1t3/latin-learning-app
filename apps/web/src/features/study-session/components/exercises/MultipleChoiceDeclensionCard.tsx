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
import type { LatinWord } from '../WordCard';
import BaseDrillCard from './BaseDrillCard';
import { LATIN_COLORS } from '../../../../config/theme';

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
  
  // Ocultar encabezado para ahorrar espacio
  hideHeader?: boolean;
}

/**
 * INFORMACIÓN SOBRE LAS DECLINACIONES (versión expandida con más tips)
 * Usa el nuevo sistema de colores armonizado
 */
const DECLENSION_INFO = {
  '1st': {
    label: '1ª',
    fullLabel: 'Primera Declinación',
    color: LATIN_COLORS.declensions['1st'],  // Deep Purple from theme
    hint: '-ae',
    example: 'rosa, rosae',
    // Tips educativos expandidos
    gender: 'Mayoría femeninas (excepciones: poeta, nauta, agricola)',
    pattern: 'Nom: -a, Gen: -ae',
    mnemonic: 'Termina en -A como RosA, AquA'
  },
  '2nd': {
    label: '2ª',
    fullLabel: 'Segunda Declinación', 
    color: LATIN_COLORS.declensions['2nd'],  // Bright Blue from theme
    hint: '-i',
    example: 'dominus, domini',
    gender: 'Masculinos (-us/-er) y Neutros (-um)',
    pattern: 'Masc: -us/-er → -i, Neut: -um → -i',
    mnemonic: 'DominUS dominI, templUM templI'
  },
  '3rd': {
    label: '3ª',
    fullLabel: 'Tercera Declinación',
    color: LATIN_COLORS.declensions['3rd'],  // Teal from theme
    hint: '-is',
    example: 'rex, regis',
    gender: 'Todos los géneros posibles',
    pattern: 'Variado → Gen: -is (siempre)',
    mnemonic: 'La más variada, pero Gen siempre en -IS'
  },
  '4th': {
    label: '4ª',
    fullLabel: 'Cuarta Declinación',
    color: LATIN_COLORS.declensions['4th'],  // Deep Orange from theme
    hint: '-us',
    example: 'manus, manus',
    gender: 'Mayoría masculinos, algunas fem (manus, domus)',
    pattern: 'Nom: -us, Gen: -us (¡igual!)',
    mnemonic: 'ManUS manUS - ¡se repite!'
  },
  '5th': {
    label: '5ª',
    fullLabel: 'Quinta Declinación',
    color: LATIN_COLORS.declensions['5th'],  // Pink/Magenta from theme
    hint: '-ei',
    example: 'dies, diei',
    gender: 'Mayoría femeninas (excepto dies)',
    pattern: 'Nom: -es, Gen: -ei',
    mnemonic: 'DiES diEI, rES rEI - muy pocas palabras'
  }
};

/**
 * COMPONENTE PRINCIPAL
 */
const MultipleChoiceDeclensionCard: React.FC<MultipleChoiceDeclensionCardProps> = ({
  currentWord,
  onAnswer,
  showLabels = true,
  compact = false,
  hideHeader = false
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
    const declensionColor = DECLENSION_INFO[declension as keyof typeof DECLENSION_INFO].color;
    
    if (!hasAnswered) {
      return declensionColor;
    }
    
    // Después de responder, mantener colores de declinación pero con diferente intensidad
    if (declension === correctDeclension) {
      return declensionColor;  // Color completo para la respuesta correcta
    }
    
    if (declension === selectedDeclension && !isCorrect) {
      return declensionColor;  // Mantener color pero se verá con opacity
    }
    
    return '#666666';  // Gris para las no seleccionadas
  };
  
  /**
   * CONTENIDO DEL EJERCICIO
   */
  const exerciseContent = (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* PALABRA A IDENTIFICAR */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: isCompact ? 2 : 3,
          px: 2,
          bgcolor: 'background.default',
          borderRadius: 2,
          mb: isCompact ? 2 : 3,
          mx: 'auto',
          maxWidth: '100%'
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
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',  // minmax prevents overflow
        gap: isCompact ? 0.5 : 1,
        width: '100%',
        px: isCompact ? 0.5 : 1  // Small padding to prevent edge touching
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
                width: '100%',  // Full width of grid cell
                minWidth: 0,    // Override MUI default
                height: isCompact ? 56 : 72,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: isCompact ? 0.25 : 0.5,
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
                  // Diferenciar opacidad: correcta = 1, incorrecta seleccionada = 0.7, otras = 0.4
                  opacity: hasAnswered ? (
                    isCorrectAnswer ? 1 : 
                    isSelected ? 0.7 : 
                    0.4
                  ) : 0.6
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
            mx: isCompact ? 0 : 1,  // Margin horizontal para no tocar bordes
            p: isCompact ? 1 : 1.5,
            borderRadius: 1,
            bgcolor: alpha(DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].color, 0.15),  // Usar color de la declinación
            border: 2,
            borderColor: DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].color,  // Borde del color de la declinación
            width: 'calc(100% - 16px)',  // Compensar por márgenes
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Indicador de resultado */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            {isCorrect ? (
              <CheckCircleIcon sx={{ color: DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].color, fontSize: 20 }} />
            ) : (
              <CancelIcon sx={{ color: DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].color, fontSize: 20 }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].color,
                fontWeight: 'bold' 
              }}
            >
              {isCorrect ? '¡Correcto!' : 'Respuesta incorrecta'}
            </Typography>
          </Stack>
          
          {/* Información principal */}
          <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
            <strong>{currentWord.nominative}</strong> → {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].fullLabel}
          </Typography>
          
          {/* Patrón de la declinación */}
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            📖 {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].pattern}
          </Typography>
          
          {/* Información de género */}
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            ⚡ {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].gender}
          </Typography>
          
          {/* Truco mnemotécnico */}
          <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', fontWeight: 'medium' }}>
            💡 {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].mnemonic}
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
      title="Identifica la Declinación"
      subtitle="¿A qué declinación pertenece esta palabra?"
      isAnswered={hasAnswered}
      isCorrect={isCorrect}
      compact={isCompact}
      hideHeader={hideHeader}
      exerciseContent={exerciseContent}
      feedbackContent={
        hasAnswered && !showLabels && (
          <Typography variant="caption">
            {currentWord.nominative} → {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].fullLabel}
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