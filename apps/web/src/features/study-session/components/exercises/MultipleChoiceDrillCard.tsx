/**
 * MULTIPLE CHOICE DRILL CARD COMPONENT
 * 
 * Implementación específica de drill card para ejercicios de opción múltiple.
 * Extiende BaseDrillCard mediante composición (no herencia).
 * 
 * CONCEPTOS IMPORTANTES:
 * - Composición sobre herencia: React favorece la composición
 * - Especialización: Este componente especializa BaseDrillCard
 * - Delegación: Delega la presentación a BaseDrillCard
 */

import React, { useState } from 'react';
import BaseDrillCard from './BaseDrillCard';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import type { LatinWord } from '../WordCard';
import type { QuestionType } from './MultipleChoiceExercise';

/**
 * PROPS ESPECÍFICAS DE MULTIPLE CHOICE
 * Extiende las props base agregando las específicas de este tipo
 */
interface MultipleChoiceDrillCardProps {
  // Datos del ejercicio
  currentWord: LatinWord;                    // Palabra actual
  allWords: LatinWord[];                     // Todas las palabras
  questionType?: QuestionType;               // Tipo de pregunta
  
  // Callbacks
  onAnswer?: (isCorrect: boolean) => void;   // Cuando se responde
  
  // Configuración del ejercicio
  numberOfOptions?: number;                   // Número de opciones
  showLabels?: boolean;                      // Mostrar A, B, C, D
  
  // Configuración visual
  compact?: boolean;                         // Versión compacta
}

/**
 * MULTIPLE CHOICE DRILL CARD
 * 
 * Usa BaseDrillCard como "clase base" mediante composición.
 * Este componente:
 * 1. Prepara los datos específicos del ejercicio
 * 2. Renderiza el contenido del ejercicio
 * 3. Delega la presentación a BaseDrillCard
 */
const MultipleChoiceDrillCard: React.FC<MultipleChoiceDrillCardProps> = ({
  currentWord,
  allWords,
  questionType = 'latinToSpanish',
  onAnswer,
  numberOfOptions = 4,
  showLabels = true,
  compact = false
}) => {
  // Estado local para manejar el flujo del ejercicio
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  /**
   * OBTENER INFORMACIÓN DEL TIPO DE EJERCICIO
   * Datos específicos según el tipo de pregunta
   */
  const getExerciseInfo = () => {
    switch (questionType) {
      case 'latinToSpanish':
        return {
          title: 'Traducción al Español',
          subtitle: 'Selecciona la traducción correcta'
        };
      
      case 'spanishToLatin':
        return {
          title: 'Traducción al Latín',
          subtitle: 'Selecciona la palabra latina correcta'
        };

      case 'declension':
        return {
          title: 'Identificar Declinación',
          subtitle: 'Selecciona la declinación correcta'
        };
      
      default:
        return {
          title: 'Traducción al Español',
          subtitle: 'Selecciona la traducción correcta'
        };
    }
  };
  
  /**
   * MANEJAR RESPUESTA DEL EJERCICIO
   */
  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    setIsCorrect(correct);
    if (onAnswer) {
      onAnswer(correct);
    }
  };
  
  const exerciseInfo = getExerciseInfo();
  
  /**
   * RENDERIZADO USANDO COMPOSICIÓN
   * 
   * En lugar de "heredar" de BaseDrillCard, lo usamos como componente
   * y le pasamos nuestro contenido específico.
   * 
   * Esto es el equivalente en React a la herencia en OOP:
   * - BaseDrillCard es la "clase base"
   * - MultipleChoiceDrillCard es la "clase derivada"
   * - exerciseContent es el "método override"
   */
  return (
    <BaseDrillCard
      // Props del encabezado
      title={exerciseInfo.title}
      subtitle={exerciseInfo.subtitle}
      
      // Estado del ejercicio
      isAnswered={isAnswered}
      isCorrect={isCorrect}
      
      // Configuración visual
      compact={compact}
      
      // CONTENIDO ESPECÍFICO DEL EJERCICIO
      // Esto es lo que hace único a MultipleChoice
      exerciseContent={
        <MultipleChoiceExercise
          currentWord={currentWord}
          allWords={allWords}
          questionType={questionType}
          onAnswer={handleAnswer}
          numberOfOptions={numberOfOptions}
          showLabels={showLabels}
        />
      }
    />
  );
};

export default MultipleChoiceDrillCard;

/**
 * PATRÓN DE COMPOSICIÓN vs HERENCIA
 * 
 * En lenguajes OOP tradicionales:
 * ```java
 * class MultipleChoiceDrillCard extends BaseDrillCard {
 *   @Override
 *   renderExerciseContent() { ... }
 * }
 * ```
 * 
 * En React con composición:
 * ```tsx
 * <BaseDrillCard
 *   exerciseContent={<MySpecificContent />}
 * />
 * ```
 * 
 * VENTAJAS DE LA COMPOSICIÓN:
 * 1. Más flexible que la herencia
 * 2. Evita jerarquías complejas
 * 3. Composición en tiempo de ejecución
 * 4. Más fácil de testear
 * 5. Mejor separación de responsabilidades
 * 
 * CÓMO CREAR NUEVOS TIPOS DE DRILL CARDS:
 * 1. Crear el componente del ejercicio (ej: FillInBlankExercise)
 * 2. Crear el DrillCard que usa BaseDrillCard
 * 3. Pasar el ejercicio como exerciseContent
 * 4. Agregar lógica específica si es necesaria
 */