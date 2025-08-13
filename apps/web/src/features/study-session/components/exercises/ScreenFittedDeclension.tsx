/**
 * SCREEN-FITTED DECLENSION EXERCISE
 * 
 * Versión del ejercicio de declinación que siempre ocupa
 * exactamente el espacio disponible en la pantalla.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Layout fijo sin scroll
 * - Distribución eficiente del espacio
 * - Colores armonizados por declinación
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { LatinWord } from '../WordCard';

/**
 * PROPS DEL COMPONENTE
 */
interface ScreenFittedDeclensionProps {
  // Palabra para el ejercicio
  currentWord: LatinWord;
  
  // Callback cuando el usuario responde
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * INFORMACIÓN DE DECLINACIONES - Versión compacta
 */
const DECLENSION_INFO = {
  '1st': {
    label: '1ª',
    fullLabel: 'Primera Declinación',
    color: '#A78BFA',  // Violeta
    hint: '-ae',
    example: 'rosa, rosae'
  },
  '2nd': {
    label: '2ª',
    fullLabel: 'Segunda Declinación', 
    color: '#818CF8',  // Índigo
    hint: '-i',
    example: 'dominus, domini'
  },
  '3rd': {
    label: '3ª',
    fullLabel: 'Tercera Declinación',
    color: '#22D3EE',  // Cyan
    hint: '-is',
    example: 'rex, regis'
  },
  '4th': {
    label: '4ª',
    fullLabel: 'Cuarta Declinación',
    color: '#FBD38D',  // Ámbar
    hint: '-us',
    example: 'manus, manus'
  },
  '5th': {
    label: '5ª',
    fullLabel: 'Quinta Declinación',
    color: '#FDA4AF',  // Rosa Coral
    hint: '-ei',
    example: 'dies, diei'
  }
};

/**
 * SCREEN-FITTED DECLENSION
 */
const ScreenFittedDeclension: React.FC<ScreenFittedDeclensionProps> = ({
  currentWord,
  onAnswer
}) => {
  // Estado del ejercicio
  const [selectedDeclension, setSelectedDeclension] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
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
    
    // Después de responder
    if (declension === correctDeclension) {
      return declensionColor;  // Mantener color para correcta
    }
    
    if (declension === selectedDeclension && !isCorrect) {
      return '#F44336';  // Rojo para incorrecta seleccionada
    }
    
    return '#666666';  // Gris para las demás
  };
  
  /**
   * OBTENER ETIQUETA DE GÉNERO
   */
  const getGenderLabel = (gender: string): string => {
    switch (gender) {
      case 'masculine': return 'masculino';
      case 'feminine': return 'femenino';
      case 'neuter': return 'neutro';
      default: return gender;
    }
  };
  
  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* SECCIÓN DE PALABRA - Tamaño fijo */}
      <Box sx={{ 
        flexShrink: 0,
        textAlign: 'center',
        py: 2,
        px: 2,
        bgcolor: 'background.default',
        borderRadius: 2,
        mb: 2
      }}>
        {/* Pregunta */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 1.5,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          ¿A qué declinación pertenece esta palabra?
        </Typography>
        
        {/* Nominativo */}
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 0.5,
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
          }}
        >
          {currentWord.nominative}
        </Typography>
        
        {/* Genitivo (pista importante) */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            fontStyle: 'italic',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {currentWord.genitive}
        </Typography>
        
        {/* Género */}
        <Chip
          label={getGenderLabel(currentWord.gender)}
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* SECCIÓN DE OPCIONES - Ocupa el espacio restante */}
      <Box sx={{ 
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 2,
        pb: 2
      }}>
        {/* Grid de 5 botones para las declinaciones */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: { xs: 0.5, sm: 1 },
          width: '100%',
          mb: 2
        }}>
          {declensionOptions.map((declension) => {
            const info = DECLENSION_INFO[declension];
            const buttonColor = getButtonColor(declension);
            const isSelected = selectedDeclension === declension;
            const isCorrectAnswer = declension === correctDeclension;
            
            return (
              <Button
                key={declension}
                variant={isSelected || (hasAnswered && isCorrectAnswer) ? 'contained' : 'outlined'}
                onClick={() => handleSelectDeclension(declension)}
                disabled={hasAnswered}
                sx={{
                  // Propiedades flexbox para tamaño uniforme de botones
                  flex: '1 1 auto',  // Permite crecer y encoger según espacio disponible
                  minWidth: { xs: 55, sm: 70 },  // Ancho mínimo para legibilidad
                  maxWidth: { xs: 90, sm: 110 },  // Ancho máximo para evitar estiramiento excesivo
                  height: { xs: 80, sm: 100 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: { xs: 0.5, sm: 1 },
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
                    opacity: hasAnswered ? (
                      isCorrectAnswer ? 1 : 
                      isSelected ? 0.7 : 
                      0.4
                    ) : 0.6
                  }
                }}
              >
                {/* Icono de resultado */}
                {hasAnswered && isCorrectAnswer && (
                  <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 20 }, mb: 0.5 }} />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <CancelIcon sx={{ fontSize: { xs: 16, sm: 20 }, mb: 0.5 }} />
                )}
                
                {/* Número de declinación */}
                <Typography 
                  variant="h6"
                  sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {info.label}
                </Typography>
                
                {/* Terminación característica */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    opacity: 0.8,
                    lineHeight: 1
                  }}
                >
                  {info.hint}
                </Typography>
              </Button>
            );
          })}
        </Box>

        {/* Información adicional de cada declinación - También usando flexbox
            Mantiene la misma alineación que los botones de arriba
        */}
        <Box sx={{ 
          display: 'flex',  // Cambiado de grid a flex para consistencia
          flexWrap: 'wrap',  // Permite envolver si es necesario
          justifyContent: 'center',  // Centra los elementos
          gap: { xs: 0.5, sm: 1 },
          width: '100%'
        }}>
          {declensionOptions.map((declension) => {
            const info = DECLENSION_INFO[declension];
            const isCorrectAnswer = declension === correctDeclension;
            
            return (
              <Box
                key={`info-${declension}`}
                sx={{
                  // Propiedades flex para alineación con botones de arriba
                  flex: '1 1 auto',  // Mismo comportamiento flex que los botones
                  minWidth: { xs: 55, sm: 70 },  // Mismo ancho mínimo que botones
                  maxWidth: { xs: 90, sm: 110 },  // Mismo ancho máximo que botones
                  textAlign: 'center',
                  opacity: hasAnswered && !isCorrectAnswer ? 0.4 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    color: 'text.secondary',
                    display: 'block'
                  }}
                >
                  {info.example.split(', ')[0]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* FEEDBACK - Overlay al responder */}
      {hasAnswered && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: isCorrect 
            ? alpha(DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].color, 0.95)
            : alpha('#F44336', 0.95),
          color: '#fff',
          textAlign: 'center',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {isCorrect 
              ? `¡Correcto! ${currentWord.nominative} es ${DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].fullLabel}`
              : `Incorrecto. ${currentWord.nominative} es ${DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].fullLabel}`
            }
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.9 }}>
            El genitivo "{currentWord.genitive}" termina en {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].hint}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ScreenFittedDeclension;

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SCREEN FIT:
 *    - Sin scroll en ningún caso
 *    - Grid de 5 columnas para las opciones
 *    - Feedback como overlay
 * 
 * 2. RESPONSIVE:
 *    - Tamaños adaptativos para móvil
 *    - Grid funciona en todas las pantallas
 *    - Texto legible en todos los tamaños
 * 
 * 3. VISUAL:
 *    - Colores armonizados por declinación
 *    - Estados claros (normal, seleccionado, correcto, incorrecto)
 *    - Transiciones suaves
 * 
 * 4. EDUCATIVO:
 *    - Muestra el genitivo como pista principal
 *    - Ejemplos de cada declinación
 *    - Explicación en el feedback
 */