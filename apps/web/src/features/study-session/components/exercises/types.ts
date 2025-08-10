/**
 * TIPOS PARA EJERCICIOS DE ESTUDIO
 * 
 * Define las interfaces y tipos comunes para todos los ejercicios
 * de práctica en la sesión de estudio
 */

import type { LatinWord } from '../WordCard';

/**
 * TIPO DE PREGUNTA
 * Define qué se le pide al usuario
 */
export type QuestionType = 
  | 'latinToSpanish'    // Mostrar latín, pedir español
  | 'spanishToLatin'    // Mostrar español, pedir latín
  | 'declension'        // Identificar la declinación
  | 'gender';           // Identificar el género

/**
 * RESULTADO DE UN EJERCICIO
 * Información sobre la respuesta del usuario
 */
export interface ExerciseResult {
  correct: boolean;           // Si la respuesta fue correcta
  userAnswer: string;         // Lo que respondió el usuario
  correctAnswer: string;      // La respuesta correcta
  timeSpent: number;          // Tiempo en segundos
  word: LatinWord;           // La palabra que se estaba practicando
  exerciseType: string;       // Tipo de ejercicio
}

/**
 * PROPS BASE PARA TODOS LOS EJERCICIOS
 * Cada componente de ejercicio debe recibir estas props
 */
export interface BaseExerciseProps {
  word: LatinWord;                              // Palabra a practicar
  questionType: QuestionType;                   // Qué preguntar
  onAnswer: (result: ExerciseResult) => void;   // Callback al responder
  onSkip?: () => void;                          // Opcional: saltar pregunta
}

/**
 * OPCIÓN PARA MULTIPLE CHOICE
 */
export interface MultipleChoiceOption {
  id: string;           // ID único de la opción
  text: string;         // Texto a mostrar
  isCorrect: boolean;   // Si es la respuesta correcta
}