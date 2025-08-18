/**
 * TIPOS DE STUDY SESSION
 * Este archivo contiene todas las definiciones de tipos para la funcionalidad
 * de sesiones de estudio. Mantener los tipos en un archivo separado es una
 * buena práctica porque:
 * 1. Evita dependencias circulares
 * 2. Facilita la reutilización
 * 3. Mejora la organización del código
 */

/**
 * DrillType - Tipos de ejercicios disponibles
 * Usamos un tipo union literal (valores específicos de string)
 * para tener mayor seguridad de tipos
 * 
 * NOTA: Estos tipos deben coincidir con los de DrillSessionComponent
 * - multipleChoice: Ejercicio de opción múltiple tradicional
 * - multipleChoiceDeclension: Ejercicio específico para identificar declinaciones
 * - typeLatinWord: Ejercicio de escritura - escribir la palabra latina completa
 */
export type DrillType = 'multipleChoice' | 'multipleChoiceDeclension' | 'typeLatinWord';

/**
 * Declension - Las cinco declinaciones del latín
 */
export type Declension = '1st' | '2nd' | '3rd' | '4th' | '5th';

/**
 * Gender - Los géneros gramaticales del latín
 * 'common' es para palabras que pueden ser tanto masculinas como femeninas
 */
export type Gender = 'masculine' | 'feminine' | 'neuter' | 'common';

/**
 * Configuración para mostrar información sobre cada tipo de ejercicio
 */
export interface DrillTypeInfo {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * Duración de sesión en minutos
 * Limitamos a valores específicos para mantener consistencia
 * Este tipo se usa en DurationSelector y otros componentes
 */
export type SessionDuration = 5 | 10 | 15;

/**
 * Estado de una sesión de estudio
 */
export interface StudySessionState {
  duration: SessionDuration;
  drillTypes: DrillType[];
  selectedWords: string[]; // IDs de palabras seleccionadas
}