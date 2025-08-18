/**
 * SCREEN-FITTED MULTIPLE CHOICE COMPONENT
 * 
 * Versión del ejercicio de opción múltiple que siempre ocupa
 * exactamente el espacio disponible en la pantalla, sin scroll.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Viewport Units: Usa vh (viewport height) para sizing
 * - Flexbox: Distribución flexible del espacio
 * - No Scroll: Todo debe caber en la pantalla
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { LatinWord } from '../global/WordCard';
import { getDeclensionColor } from '../../features/study-session/constants/colors';

/**
 * TIPOS DE PREGUNTA
 */
export type QuestionType = 'latinToSpanish' | 'spanishToLatin' | 'gender' | 'declension';

/**
 * PROPS DEL COMPONENTE
 */
interface ScreenFittedMultipleChoiceProps {
  // Palabra actual para el ejercicio
  currentWord: LatinWord;
  
  // Palabras disponibles para generar opciones incorrectas
  allWords: LatinWord[];
  
  // Tipo de pregunta
  questionType?: QuestionType;
  
  // Callback cuando el usuario responde
  onAnswer: (isCorrect: boolean) => void;
  
  // Número de opciones (default: 4)
  numberOfOptions?: number;
}

/**
 * SCREEN-FITTED MULTIPLE CHOICE
 * 
 * Diseñado para ocupar exactamente el espacio disponible
 * sin necesidad de scroll en ningún dispositivo.
 */
const ScreenFittedMultipleChoice: React.FC<ScreenFittedMultipleChoiceProps> = ({
  currentWord,
  allWords,
  questionType = 'latinToSpanish',
  onAnswer,
  numberOfOptions = 4
}) => {
  // Estado del ejercicio
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [options, setOptions] = useState<Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>>([]);

  /**
   * OBTENER ETIQUETA DE GÉNERO
   */
  const getGenderLabel = (gender: string): string => {
    switch (gender) {
      case 'masculine': return 'Masculino';
      case 'feminine': return 'Femenino';
      case 'neuter': return 'Neutro';
      case 'common': return 'Común';
      default: return gender;
    }
  };

  /**
   * OBTENER ETIQUETA DE DECLINACIÓN
   */
  const getDeclensionLabel = (declension: string): string => {
    switch (declension) {
      case '1st': return 'Primera Declinación';
      case '2nd': return 'Segunda Declinación';
      case '3rd': return 'Tercera Declinación';
      case '4th': return 'Cuarta Declinación';
      case '5th': return 'Quinta Declinación';
      default: return declension;
    }
  };

  /**
   * OBTENER LA RESPUESTA CORRECTA
   */
  const getCorrectAnswer = (): string => {
    switch (questionType) {
      case 'latinToSpanish':
        return currentWord.spanishTranslation;
      case 'spanishToLatin':
        return `${currentWord.nominative}, ${currentWord.genitive}`;
      case 'gender':
        return getGenderLabel(currentWord.gender);
      case 'declension':
        return getDeclensionLabel(currentWord.declension);
      default:
        return currentWord.spanishTranslation;
    }
  };

  /**
   * GENERAR OPCIONES INCORRECTAS
   */
  const generateIncorrectOptions = (): string[] => {
    const incorrectOptions: string[] = [];
    const usedValues = new Set<string>();
    usedValues.add(getCorrectAnswer());
    
    const availableWords = [...allWords.filter(w => w.id !== currentWord.id)];
    
    // Mezclar palabras disponibles
    const shuffled = availableWords.sort(() => Math.random() - 0.5);
    
    // Generar opciones según el tipo
    for (let i = 0; i < numberOfOptions - 1 && i < shuffled.length; i++) {
      let optionText = '';
      
      switch (questionType) {
        case 'latinToSpanish':
          optionText = shuffled[i].spanishTranslation;
          break;
        case 'spanishToLatin':
          optionText = `${shuffled[i].nominative}, ${shuffled[i].genitive}`;
          break;
        case 'gender':
          // Asegurar variedad de géneros
          const genders = ['masculine', 'feminine', 'neuter'];
          const randomGender = genders.filter(g => g !== currentWord.gender)[Math.floor(Math.random() * 2)];
          optionText = getGenderLabel(randomGender);
          break;
        case 'declension':
          // Asegurar variedad de declinaciones
          const declensions = ['1st', '2nd', '3rd', '4th', '5th'];
          const availableDeclensions = declensions.filter(d => d !== currentWord.declension);
          optionText = getDeclensionLabel(availableDeclensions[i % availableDeclensions.length]);
          break;
      }
      
      // Evitar duplicados
      if (!usedValues.has(optionText)) {
        incorrectOptions.push(optionText);
        usedValues.add(optionText);
      }
    }
    
    // Asegurar que tenemos suficientes opciones
    while (incorrectOptions.length < numberOfOptions - 1) {
      const fallback = `Opción ${incorrectOptions.length + 2}`;
      if (!usedValues.has(fallback)) {
        incorrectOptions.push(fallback);
        usedValues.add(fallback);
      }
    }
    
    return incorrectOptions;
  };

  /**
   * GENERAR OPCIONES
   */
  const generateOptions = () => {
    const newOptions: Array<{ id: string; text: string; isCorrect: boolean }> = [];
    
    // Agregar respuesta correcta
    newOptions.push({
      id: 'correct',
      text: getCorrectAnswer(),
      isCorrect: true
    });
    
    // Agregar opciones incorrectas
    const incorrectOptions = generateIncorrectOptions();
    incorrectOptions.forEach((option, index) => {
      newOptions.push({
        id: `incorrect-${index}`,
        text: option,
        isCorrect: false
      });
    });
    
    // Mezclar opciones
    const shuffled = newOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled.map((opt, idx) => ({ ...opt, id: `option-${idx}` })));
  };

  /**
   * MANEJAR SELECCIÓN
   */
  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);
    onAnswer(isCorrect);
  };

  /**
   * GENERAR OPCIONES AL CAMBIAR LA PALABRA
   */
  useEffect(() => {
    generateOptions();
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentWord.id, questionType]);

  /**
   * OBTENER PREGUNTA
   */
  const getQuestion = (): string => {
    switch (questionType) {
      case 'latinToSpanish':
        return '¿Qué significa esta palabra?';
      case 'spanishToLatin':
        return '¿Cuál es la palabra latina para...?';
      case 'gender':
        return '¿Cuál es el género de esta palabra?';
      case 'declension':
        return '¿A qué declinación pertenece?';
      default:
        return '¿Qué significa esta palabra?';
    }
  };

  /**
   * OBTENER PALABRA A MOSTRAR
   */
  const getDisplayWord = (): string => {
    switch (questionType) {
      case 'latinToSpanish':
      case 'gender':
      case 'declension':
        return currentWord.nominative;
      case 'spanishToLatin':
        return currentWord.spanishTranslation;
      default:
        return currentWord.nominative;
    }
  };

  /**
   * OBTENER INFORMACIÓN ADICIONAL
   */
  const getAdditionalInfo = (): string | null => {
    switch (questionType) {
      case 'latinToSpanish':
      case 'gender':
      case 'declension':
        return currentWord.genitive;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',  // Nunca permitir scroll
      position: 'relative'
    }}>
      {/* SECCIÓN DE PREGUNTA - Tamaño fijo */}
      <Box sx={{ 
        flexShrink: 0,  // No permitir que se encoja
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
          {getQuestion()}
        </Typography>
        
        {/* Palabra principal */}
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: getDeclensionColor(currentWord.declension),
            mb: 0.5,
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
          }}
        >
          {getDisplayWord()}
        </Typography>
        
        {/* Información adicional (genitivo) */}
        {getAdditionalInfo() && (
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {getAdditionalInfo()}
          </Typography>
        )}
        
        {/* Género (solo para algunos tipos) */}
        {(questionType === 'latinToSpanish' || questionType === 'declension') && (
          <Chip
            label={getGenderLabel(currentWord.gender)}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      {/* SECCIÓN DE OPCIONES - Ocupa el espacio restante */}
      <Box sx={{ 
        flex: 1,
        minHeight: 0,  // Importante para que flex funcione correctamente
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  // Centrar verticalmente
        px: 2,
        pb: 2
      }}>
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const showCorrect = isAnswered && option.isCorrect;
            const showIncorrect = isAnswered && isSelected && !option.isCorrect;
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
            
            return (
              <Button
                key={option.id}
                variant={isSelected ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => handleOptionClick(option.id, option.isCorrect)}
                disabled={isAnswered}
                sx={{
                  py: { xs: 1.5, sm: 2 },  // Padding vertical responsivo
                  px: 2,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderWidth: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  
                  // Colores según estado
                  borderColor: showCorrect ? 'success.main' : 
                              showIncorrect ? 'error.main' : 
                              'divider',
                  
                  bgcolor: isSelected ? (
                    showCorrect ? 'success.main' :
                    showIncorrect ? 'error.main' :
                    'primary.main'
                  ) : 'transparent',
                  
                  color: isSelected ? '#fff' : 'text.primary',
                  
                  '&:hover': {
                    borderColor: isAnswered ? undefined : 'primary.main',
                    bgcolor: isSelected ? undefined : alpha('#BB86FC', 0.08)
                  },
                  
                  '&.Mui-disabled': {
                    borderColor: showCorrect ? 'success.main' : 
                                showIncorrect ? 'error.main' : 
                                'divider',
                    color: isSelected || showCorrect ? '#fff' : 'text.secondary',
                    bgcolor: showCorrect ? alpha('#4CAF50', 0.9) :
                            showIncorrect ? alpha('#F44336', 0.9) :
                            isSelected ? 'primary.main' :
                            'transparent'
                  }
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                  {/* Etiqueta A, B, C, D */}
                  <Chip
                    label={optionLabel}
                    size="small"
                    sx={{
                      minWidth: 32,
                      height: 24,
                      bgcolor: isSelected || showCorrect ? 
                        'rgba(255,255,255,0.2)' : 
                        'background.default',
                      color: isSelected || showCorrect ? 
                        'inherit' : 
                        'text.secondary',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  />
                  
                  {/* Texto de la opción */}
                  <Typography sx={{ flex: 1 }}>
                    {option.text}
                  </Typography>
                  
                  {/* Iconos de resultado */}
                  {showCorrect && <CheckCircleIcon sx={{ fontSize: 20 }} />}
                  {showIncorrect && <CancelIcon sx={{ fontSize: 20 }} />}
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* FEEDBACK - Aparece sobre las opciones cuando se responde */}
      {isAnswered && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: selectedOption && options.find(o => o.id === selectedOption)?.isCorrect 
            ? alpha('#4CAF50', 0.95)
            : alpha('#F44336', 0.95),
          color: '#fff',
          textAlign: 'center',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {selectedOption && options.find(o => o.id === selectedOption)?.isCorrect 
              ? '¡Correcto! 🎉'
              : `Incorrecto. La respuesta era: ${getCorrectAnswer()}`
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ScreenFittedMultipleChoice;

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SCREEN FIT:
 *    - Usa flexbox para distribuir el espacio
 *    - Sección de pregunta con tamaño fijo
 *    - Opciones ocupan el espacio restante
 *    - Sin scroll en ningún caso
 * 
 * 2. RESPONSIVE:
 *    - Tamaños de fuente adaptativos
 *    - Padding responsivo
 *    - Funciona en móvil y desktop
 * 
 * 3. FEEDBACK:
 *    - Aparece como overlay al responder
 *    - No afecta el layout
 *    - Colores claros de éxito/error
 * 
 * 4. OPTIMIZACIÓN:
 *    - Mínimo uso de espacio vertical
 *    - Todo visible sin scroll
 *    - Botones grandes para touch
 */