/**
 * MULTIPLE CHOICE DECLENSION EXERCISE
 * 
 * Ejercicio de selección múltiple para identificar la declinación
 * de una palabra latina. El usuario ve una palabra y debe elegir
 * entre las 5 declinaciones posibles.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Declinación: Sistema de casos en latín (1ª a 5ª)
 * - Multiple Choice: Ejercicio con opciones predefinidas
 * - Visual Feedback: Colores y animaciones para indicar resultado
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Fade,
  Chip,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import type { LatinWord } from '../global/WordCard';

/**
 * PROPS DEL COMPONENTE
 */
interface MultipleChoiceDeclensionProps {
  // Palabra para el ejercicio
  word: LatinWord;
  
  // Callback cuando el usuario responde
  onAnswer: (isCorrect: boolean, selectedDeclension: string) => void;
  
  // Mostrar explicación después de responder
  showExplanation?: boolean;
  
  // Deshabilitado durante carga o transición
  disabled?: boolean;
}

/**
 * INFORMACIÓN SOBRE LAS DECLINACIONES
 * Cada declinación tiene características distintivas
 */
const DECLENSION_INFO = {
  '1st': {
    label: '1ª Declinación',
    color: '#BB86FC', // púrpura
    description: 'Gen. -ae (fem.)',
    examples: 'rosa, aqua, puella'
  },
  '2nd': {
    label: '2ª Declinación',
    color: '#03DAC6', // cyan
    description: 'Gen. -i (masc/neut)',
    examples: 'dominus, templum, puer'
  },
  '3rd': {
    label: '3ª Declinación',
    color: '#4CAF50', // verde
    description: 'Gen. -is (todos)',
    examples: 'rex, corpus, civis'
  },
  '4th': {
    label: '4ª Declinación',
    color: '#FF9800', // naranja
    description: 'Gen. -us (masc/fem)',
    examples: 'manus, exercitus, domus'
  },
  '5th': {
    label: '5ª Declinación',
    color: '#F44336', // rojo
    description: 'Gen. -ei (fem)',
    examples: 'dies, res, spes'
  }
};

/**
 * COMPONENTE PRINCIPAL
 */
const MultipleChoiceDeclension: React.FC<MultipleChoiceDeclensionProps> = ({
  word,
  onAnswer,
  showExplanation = true,
  disabled = false
}) => {
  // Estado del ejercicio
  const [selectedDeclension, setSelectedDeclension] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Respuesta correcta
  const correctDeclension = word.declension;
  
  // Opciones disponibles (siempre las 5 declinaciones)
  const declensionOptions = ['1st', '2nd', '3rd', '4th', '5th'] as const;
  
  /**
   * MANEJAR SELECCIÓN DE DECLINACIÓN
   */
  const handleSelectDeclension = (declension: string) => {
    // Si ya respondió o está deshabilitado, no hacer nada
    if (hasAnswered || disabled) return;
    
    // Marcar como seleccionada
    setSelectedDeclension(declension);
    
    // Verificar si es correcta
    const correct = declension === correctDeclension;
    setIsCorrect(correct);
    setHasAnswered(true);
    
    // Notificar al padre
    onAnswer(correct, declension);
  };
  
  /**
   * RESETEAR CUANDO CAMBIA LA PALABRA
   */
  useEffect(() => {
    setSelectedDeclension(null);
    setHasAnswered(false);
    setIsCorrect(false);
  }, [word.id]);
  
  /**
   * OBTENER COLOR DE BOTÓN
   * Dependiendo del estado del ejercicio
   */
  const getButtonColor = (declension: string) => {
    // Si no ha respondido, usar colores por declinación
    if (!hasAnswered) {
      return DECLENSION_INFO[declension as keyof typeof DECLENSION_INFO].color;
    }
    
    // Si ha respondido, mostrar feedback
    if (declension === correctDeclension) {
      return '#4CAF50'; // Verde para correcta
    }
    
    if (declension === selectedDeclension && !isCorrect) {
      return '#F44336'; // Rojo para incorrecta seleccionada
    }
    
    // Gris para las demás
    return '#666666';
  };
  
  /**
   * DETERMINAR SI UN BOTÓN DEBE ESTAR DESHABILITADO
   */
  const isButtonDisabled = (_declension: string) => {
    return hasAnswered || disabled;
  };
  
  return (
    <Card 
      elevation={3}
      sx={{ 
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        bgcolor: 'background.paper'
      }}
      data-testid="multiple-choice-declension"
    >
      <CardContent sx={{ p: 3 }}>
        {/* ENCABEZADO */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Identifica la Declinación
          </Typography>
        </Stack>
        
        {/* PALABRA A IDENTIFICAR */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            px: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
            mb: 4
          }}
        >
          {/* Palabra en latín */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 1
            }}
          >
            {word.nominative}
          </Typography>
          
          {/* Genitivo como pista */}
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            {word.genitive}
          </Typography>
          
          {/* Género */}
          <Chip
            label={
              word.gender === 'masculine' ? 'masculino' :
              word.gender === 'feminine' ? 'femenino' :
              word.gender === 'neuter' ? 'neutro' :
              'común'
            }
            size="small"
            sx={{ mt: 2 }}
          />
        </Box>
        
        {/* PREGUNTA */}
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            mb: 3,
            color: 'text.secondary'
          }}
        >
          ¿A qué declinación pertenece esta palabra?
        </Typography>
        
        {/* OPCIONES DE DECLINACIÓN */}
        <Stack spacing={2}>
          {declensionOptions.map((declension) => {
            const info = DECLENSION_INFO[declension];
            const buttonColor = getButtonColor(declension);
            const isDisabled = isButtonDisabled(declension);
            const isSelected = selectedDeclension === declension;
            const isCorrectAnswer = declension === correctDeclension;
            
            return (
              <Button
                key={declension}
                variant={isSelected ? 'contained' : 'outlined'}
                fullWidth
                size="large"
                disabled={isDisabled}
                onClick={() => handleSelectDeclension(declension)}
                sx={{
                  py: 2,
                  px: 3,
                  justifyContent: 'space-between',
                  borderColor: buttonColor,
                  borderWidth: 2,
                  color: isSelected || hasAnswered ? '#fff' : buttonColor,
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
                    borderWidth: hasAnswered && isCorrectAnswer ? 2 : 1,
                    color: hasAnswered ? '#fff' : '#666',
                    bgcolor: hasAnswered && isCorrectAnswer 
                      ? buttonColor 
                      : 'transparent',
                    opacity: hasAnswered && (isSelected || isCorrectAnswer) ? 1 : 0.6
                  },
                  transition: 'all 0.3s ease'
                }}
                startIcon={
                  hasAnswered && isCorrectAnswer ? <CheckCircleIcon /> :
                  hasAnswered && isSelected && !isCorrect ? <CancelIcon /> :
                  null
                }
                data-testid={`declension-option-${declension}`}
              >
                {/* Información de la declinación */}
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {info.label}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {info.description}
                  </Typography>
                </Box>
                
                {/* Ejemplos (solo si no ha respondido) */}
                {!hasAnswered && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontStyle: 'italic',
                      opacity: 0.7,
                      ml: 2
                    }}
                  >
                    ej: {info.examples.split(', ').slice(0, 2).join(', ')}
                  </Typography>
                )}
              </Button>
            );
          })}
        </Stack>
        
        {/* FEEDBACK Y EXPLICACIÓN */}
        {hasAnswered && showExplanation && (
          <Fade in>
            <Box 
              sx={{ 
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: isCorrect 
                  ? alpha('#4CAF50', 0.1)
                  : alpha('#F44336', 0.1),
                border: 1,
                borderColor: isCorrect ? '#4CAF50' : '#F44336'
              }}
            >
              {/* Resultado */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                {isCorrect ? (
                  <>
                    <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                    <Typography sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      ¡Correcto!
                    </Typography>
                  </>
                ) : (
                  <>
                    <CancelIcon sx={{ color: '#F44336' }} />
                    <Typography sx={{ color: '#F44336', fontWeight: 'bold' }}>
                      Incorrecto
                    </Typography>
                  </>
                )}
              </Stack>
              
              {/* Explicación */}
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                <strong>{word.nominative}</strong> pertenece a la{' '}
                <strong>{DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].label}</strong>.
              </Typography>
              
              {/* Pista sobre el genitivo */}
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                El genitivo <em>{word.genitive}</em> termina en{' '}
                <strong>
                  {correctDeclension === '1st' ? '-ae' :
                   correctDeclension === '2nd' ? '-i' :
                   correctDeclension === '3rd' ? '-is' :
                   correctDeclension === '4th' ? '-us' :
                   '-ei'}
                </strong>
                , característico de la {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].label}.
              </Typography>
              
              {/* Más ejemplos */}
              <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                Otros ejemplos: {DECLENSION_INFO[correctDeclension as keyof typeof DECLENSION_INFO].examples}
              </Typography>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceDeclension;

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. DISEÑO VISUAL:
 *    - Cada declinación tiene su color distintivo
 *    - Feedback visual claro (verde = correcto, rojo = incorrecto)
 *    - Animaciones suaves con Fade
 * 
 * 2. INFORMACIÓN EDUCATIVA:
 *    - Muestra el genitivo como pista principal
 *    - Incluye ejemplos de cada declinación
 *    - Explicación detallada después de responder
 * 
 * 3. ACCESIBILIDAD:
 *    - Botones grandes y fáciles de clickear
 *    - Colores con buen contraste
 *    - data-testid para testing
 * 
 * 4. FLUJO DE USUARIO:
 *    - Ve la palabra y su genitivo
 *    - Selecciona una declinación
 *    - Recibe feedback inmediato
 *    - Lee la explicación para aprender
 */