/**
 * MULTIPLE CHOICE EXERCISE COMPONENT
 * 
 * Componente completo para ejercicios de opción múltiple.
 * Maneja la lógica del ejercicio y renderiza las opciones.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Estado del ejercicio: Mantiene la selección y si ya se respondió
 * - Generación de opciones: Crea opciones incorrectas aleatorias
 * - Feedback inmediato: Muestra si la respuesta es correcta
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fade,
  Chip,
  Divider
} from '@mui/material';
import MultipleChoiceOption from './MultipleChoiceOption';
import type { LatinWord } from '../WordCard';
import { getDeclensionColor } from '../../constants/colors';
import { LATIN_COLORS } from '../../../../config/theme';
import { RADIUS } from '../../constants/spacing';

// Espaciados compactos para que todo quepa sin scroll
const COMPACT_SPACING = {
  sectionGap: { xs: 0.5, sm: 0.75, md: 1 },      // Más reducido para ahorrar espacio vertical
  optionGap: { xs: 0.25, sm: 0.5, md: 0.75 },    // Mínimo espacio entre opciones
  cardPadding: { xs: 0.75, sm: 1, md: 1.25 },    // Padding más reducido
};

/**
 * TIPOS DE PREGUNTA
 * Define qué tipo de pregunta hacer
 */
export type QuestionType = 'latinToSpanish' | 'spanishToLatin' | 'gender' | 'declension';

/**
 * PROPS DEL COMPONENTE
 */
interface MultipleChoiceExerciseProps {
  // Palabra actual para el ejercicio
  currentWord: LatinWord;
  
  // Palabras disponibles para generar opciones incorrectas
  allWords: LatinWord[];
  
  // Tipo de pregunta
  questionType?: QuestionType;
  
  // Callbacks
  onAnswer?: (isCorrect: boolean) => void;  // Cuando se responde
  
  // Configuración
  numberOfOptions?: number;                   // Número de opciones (default: 4)
  showLabels?: boolean;                      // Mostrar etiquetas A, B, C, D
}

/**
 * COMPONENTE DE EJERCICIO DE OPCIÓN MÚLTIPLE
 * 
 * Presenta una pregunta sobre una palabra latina con múltiples opciones
 */
const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  currentWord,
  allWords,
  questionType = 'latinToSpanish',
  onAnswer,
  numberOfOptions = 4,
  showLabels = true
}) => {
  // Estado para la opción seleccionada
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Estado para saber si ya se respondió
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Estado para las opciones del ejercicio
  const [options, setOptions] = useState<Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>>([]);

  // getExerciseTypeInfo removed - now handled by MultipleChoiceDrillCard

  /**
   * GENERAR OPCIONES PARA EL EJERCICIO
   */
  const generateOptions = () => {
    const newOptions: Array<{ id: string; text: string; isCorrect: boolean }> = [];
    
    // Agregar la respuesta correcta
    const correctAnswer = getCorrectAnswer();
    newOptions.push({
      id: `option-correct`,
      text: correctAnswer,
      isCorrect: true
    });
    
    // Generar opciones incorrectas
    const incorrectOptions = generateIncorrectOptions();
    incorrectOptions.forEach((option, index) => {
      newOptions.push({
        id: `option-${index}`,
        text: option,
        isCorrect: false
      });
    });
    
    // Mezclar las opciones aleatoriamente
    const shuffled = newOptions.sort(() => Math.random() - 0.5);
    
    // Asignar nuevos IDs basados en la posición final
    const finalOptions = shuffled.map((option, index) => ({
      ...option,
      id: `option-${index}`
    }));
    
    setOptions(finalOptions);
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
    
    // Filtrar palabras para evitar la palabra actual
    const availableWords = [...allWords.filter(w => w.id !== currentWord.id)]; // Crear copia para no mutar original
    
    // Generar opciones según el tipo de pregunta
    switch (questionType) {
      case 'latinToSpanish':
      case 'spanishToLatin':
        // Intentos máximos para evitar bucle infinito
        let attempts = 0;
        const maxAttempts = availableWords.length * 2;
        
        // Usar traducciones de otras palabras
        while (incorrectOptions.length < numberOfOptions - 1 && attempts < maxAttempts) {
          attempts++;
          
          // Si no hay suficientes palabras disponibles, romper el bucle
          if (availableWords.length === 0) break;
          
          const randomIndex = Math.floor(Math.random() * availableWords.length);
          const randomWord = availableWords[randomIndex];
          const value = questionType === 'latinToSpanish' 
            ? randomWord.spanishTranslation 
            : `${randomWord.nominative}, ${randomWord.genitive}`;
          
          if (!usedValues.has(value)) {
            incorrectOptions.push(value);
            usedValues.add(value);
            // Eliminar palabra usada para evitar duplicados
            availableWords.splice(randomIndex, 1);
          }
        }
        
        // Si no se generaron suficientes opciones, agregar opciones de respaldo
        while (incorrectOptions.length < numberOfOptions - 1) {
          const fallbackOption = questionType === 'latinToSpanish'
            ? `opción ${incorrectOptions.length + 2}`
            : `Verbum${incorrectOptions.length + 2}, verbi${incorrectOptions.length + 2}`;
          incorrectOptions.push(fallbackOption);
        }
        break;
      
      case 'gender':
        // Opciones fijas para género
        const genders = ['masculine', 'feminine', 'neuter'];
        genders.forEach(g => {
          if (g !== currentWord.gender && incorrectOptions.length < numberOfOptions - 1) {
            incorrectOptions.push(getGenderLabel(g));
          }
        });
        break;
      
      case 'declension':
        // Opciones fijas para declinación
        const declensions = ['1st', '2nd', '3rd', '4th', '5th'];
        declensions.forEach(d => {
          if (d !== currentWord.declension && incorrectOptions.length < numberOfOptions - 1) {
            incorrectOptions.push(getDeclensionLabel(d));
          }
        });
        break;
    }
    
    return incorrectOptions;
  };

  /**
   * OBTENER ETIQUETA DE GÉNERO EN ESPAÑOL
   */
  const getGenderLabel = (gender: string): string => {
    const labels: Record<string, string> = {
      masculine: 'Masculino',
      feminine: 'Femenino',
      neuter: 'Neutro'
    };
    return labels[gender] || gender;
  };

  /**
   * OBTENER ETIQUETA DE DECLINACIÓN EN ESPAÑOL
   */
  const getDeclensionLabel = (declension: string): string => {
    const labels: Record<string, string> = {
      '1st': 'Primera declinación',
      '2nd': 'Segunda declinación',
      '3rd': 'Tercera declinación',
      '4th': 'Cuarta declinación',
      '5th': 'Quinta declinación'
    };
    return labels[declension] || declension;
  };

  /**
   * MANEJAR SELECCIÓN DE OPCIÓN - VALIDACIÓN INMEDIATA
   */
  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    
    // Seleccionar la opción
    setSelectedOption(optionId);
    
    // Validar inmediatamente
    setIsAnswered(true);
    
    // Verificar si la respuesta es correcta
    const selectedOpt = options.find(opt => opt.id === optionId);
    const isCorrect = selectedOpt?.isCorrect || false;
    
    // Notificar al padre
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };


  /**
   * OBTENER ETIQUETA PARA LA OPCIÓN (A, B, C, D)
   */
  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 es el código ASCII de 'A'
  };

  // Generar opciones cuando cambie la palabra
  useEffect(() => {
    // Resetear estado cuando cambia la palabra
    setSelectedOption(null);
    setIsAnswered(false);
    generateOptions();
  }, [currentWord, questionType]);

  return (
    // Contenedor principal con flexbox para prevenir scroll
    <Box sx={{ 
      width: '100%',
      height: '100%',  // Ocupar toda la altura disponible
      display: 'flex',  // Usar flexbox
      flexDirection: 'column',  // Dirección vertical
      overflow: 'hidden'  // Prevenir scroll
    }} data-testid="multiple-choice-exercise">
      {/* PALABRA O CONCEPTO A PREGUNTAR */}
      <Box sx={{ 
        flex: '0 1 auto',  // Puede encoger si es necesario para dar espacio a las opciones
        mb: COMPACT_SPACING.sectionGap 
      }} data-testid="question-card">
        {questionType === 'spanishToLatin' ? (
          // Para Español → Latín, mostrar el español en una tarjeta simple
            <Box
              sx={{
                p: COMPACT_SPACING.cardPadding,
                textAlign: 'center',
                bgcolor: 'action.hover',  // Fondo sutil diferente
                borderRadius: RADIUS.large,
                width: '100%',
                minHeight: { xs: 80, sm: 90, md: 100 },  // Altura reducida para ahorrar espacio
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mx: 'auto',
                border: '2px solid',
                borderColor: getDeclensionColor(currentWord.declension)  // Usar color de declinación consistente
              }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: getDeclensionColor(currentWord.declension),  // Usar color de declinación
                letterSpacing: 1,
                fontSize: { xs: '1.8rem', sm: '2.125rem' }  // Más pequeño en móvil
              }}
              data-testid="spanish-word-display"
            >
              {currentWord.spanishTranslation}
            </Typography>
            {currentWord.additionalMeanings && currentWord.additionalMeanings.length > 0 && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1,
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              >
                ({currentWord.additionalMeanings.join(', ')})
              </Typography>
            )}
            </Box>
        ) : (
          // Para Latín → Español y otros tipos, mostrar en el mismo estilo
          <Box
            sx={{
              p: COMPACT_SPACING.cardPadding,
              textAlign: 'center',
              bgcolor: 'action.hover',  // Fondo sutil diferente
              borderRadius: RADIUS.large,
              width: '100%',
              minHeight: { xs: 100, sm: 120, md: 130 },  // Altura reducida para evitar scroll
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              mx: 'auto',
              border: '2px solid',
              borderColor: getDeclensionColor(currentWord.declension)  // Usar color de declinación
            }}
          >
            {/* ENUNCIACIÓN con color por declinación */}
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: getDeclensionColor(currentWord.declension),
                mb: { xs: 1, sm: 1.5 },  // Menos margen en móvil
                letterSpacing: 1,
                fontSize: { xs: '1.8rem', sm: '2.125rem' }  // Más pequeño en móvil
              }}
            >
              {currentWord.nominative}, {currentWord.genitive}
            </Typography>
            
            {/* Información gramatical compacta - Usando flexbox */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'row',
              gap: 1.5,
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0  // No permitir que se encoja
            }}>
              <Chip 
                label={`${currentWord.declension === '1st' ? '1ª' : currentWord.declension === '2nd' ? '2ª' : currentWord.declension === '3rd' ? '3ª' : currentWord.declension === '4th' ? '4ª' : '5ª'} Declinación`}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: getDeclensionColor(currentWord.declension),
                  color: getDeclensionColor(currentWord.declension),
                  borderWidth: 1.5
                }}
              />
              <Chip 
                label={currentWord.gender === 'masculine' ? 'Masculino' : currentWord.gender === 'feminine' ? 'Femenino' : 'Neutro'}
                size="small"
                sx={{ 
                  bgcolor: LATIN_COLORS.genders[currentWord.gender as keyof typeof LATIN_COLORS.genders],
                  color: 'white',
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Divider sx={{ 
        flex: '0 0 auto',  // No crecer ni encoger, mantener su tamaño
        mb: COMPACT_SPACING.sectionGap 
      }} />

      {/* OPCIONES - Usando flexbox para distribuir mejor el espacio */}
      <Box 
        data-testid="options-container"
        sx={{
          flex: 1,  // Permitir que crezca y ocupe el espacio disponible
          display: 'flex',  // Usar flexbox
          flexDirection: 'column',  // Dirección vertical
          gap: COMPACT_SPACING.optionGap,  // Espacio entre opciones
          justifyContent: 'center',  // Centrar las opciones verticalmente
          minHeight: 0,  // Importante para que flex funcione correctamente
          overflow: 'hidden'  // Prevenir scroll - las opciones deben ajustarse al espacio
        }}
      >
        {options.map((option, index) => (
          <Fade in key={option.id} timeout={300 + index * 100}>
            <Box sx={{ 
              flex: '0 1 auto',  // Puede encoger si es necesario, pero no crecer
              minHeight: 0  // Permitir que se encoja más allá de su contenido
            }}>
              <MultipleChoiceOption
                id={option.id}
                text={option.text}
                label={showLabels ? getOptionLabel(index) : undefined}
                isSelected={selectedOption === option.id}
                isCorrect={option.isCorrect}
                isAnswered={isAnswered}
                onSelect={handleSelectOption}
              />
            </Box>
          </Fade>
        ))}
      </Box>

    </Box>
  );
};

export default MultipleChoiceExercise;