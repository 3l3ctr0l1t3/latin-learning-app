/**
 * COLORES CENTRALIZADOS PARA LA APLICACIÓN
 * 
 * Este archivo define todos los colores que se usan consistentemente
 * en toda la aplicación de Latin Learning. Centralizar los colores
 * asegura consistencia visual y facilita cambios futuros.
 * 
 * IMPORTANTE: Siempre usar estos colores en lugar de definir nuevos
 * en cada componente.
 */

/**
 * COLORES POR DECLINACIÓN
 * 
 * Cada declinación latina tiene un color único asignado.
 * Estos colores se usan en chips, filtros, tarjetas, etc.
 * 
 * Sistema de colores:
 * - 1ª Declinación: Púrpura (mayoría femeninas, -ae)
 * - 2ª Declinación: Azul (masculinas/neutras, -i)
 * - 3ª Declinación: Verde (variada, -is)
 * - 4ª Declinación: Naranja (pocas palabras, -us)
 * - 5ª Declinación: Rojo (muy pocas palabras, -ei)
 */
export const DECLENSION_COLORS: Record<string, string> = {
  '1st': '#9C27B0', // Púrpura - Material Design Purple 500
  '2nd': '#2196F3', // Azul - Material Design Blue 500
  '3rd': '#4CAF50', // Verde - Material Design Green 500
  '4th': '#FF9800', // Naranja - Material Design Orange 500
  '5th': '#F44336', // Rojo - Material Design Red 500
};

/**
 * COLORES POR GÉNERO
 * 
 * Aunque ahora priorizamos colores por declinación,
 * mantenemos estos para casos específicos donde el género
 * sea más relevante que la declinación.
 */
export const GENDER_COLORS: Record<string, string> = {
  masculine: '#2196F3',  // Azul
  feminine: '#E91E63',   // Rosa
  neuter: '#9C27B0',     // Púrpura
};

/**
 * INFORMACIÓN DE DECLINACIONES
 * 
 * Metadata completa para cada declinación, incluyendo
 * color, ejemplos, y descripción.
 */
export const DECLENSION_INFO = {
  '1st': {
    color: DECLENSION_COLORS['1st'],
    label: '1ª Declinación',
    shortLabel: '1ª',
    example: 'rosa, rosae',
    description: 'Mayoría femeninas, genitivo -ae',
    commonEndings: ['-a', '-ae'],
  },
  '2nd': {
    color: DECLENSION_COLORS['2nd'],
    label: '2ª Declinación',
    shortLabel: '2ª',
    example: 'dominus, domini',
    description: 'Masculinas/neutras, genitivo -i',
    commonEndings: ['-us', '-er', '-um', '-i'],
  },
  '3rd': {
    color: DECLENSION_COLORS['3rd'],
    label: '3ª Declinación',
    shortLabel: '3ª',
    example: 'rex, regis',
    description: 'Variada, genitivo -is',
    commonEndings: ['varios', '-is'],
  },
  '4th': {
    color: DECLENSION_COLORS['4th'],
    label: '4ª Declinación',
    shortLabel: '4ª',
    example: 'manus, manus',
    description: 'Genitivo -us',
    commonEndings: ['-us', '-u', '-us'],
  },
  '5th': {
    color: DECLENSION_COLORS['5th'],
    label: '5ª Declinación',
    shortLabel: '5ª',
    example: 'dies, diei',
    description: 'Genitivo -ei',
    commonEndings: ['-es', '-ei'],
  },
};

/**
 * FUNCIÓN HELPER: Obtener color por declinación
 * 
 * @param declension - La declinación (1st, 2nd, etc.)
 * @returns El color hexadecimal correspondiente
 */
export const getDeclensionColor = (declension: string): string => {
  return DECLENSION_COLORS[declension] || '#757575'; // Gris por defecto
};

/**
 * FUNCIÓN HELPER: Obtener color por género
 * 
 * @param gender - El género (masculine, feminine, neuter)
 * @returns El color hexadecimal correspondiente
 */
export const getGenderColor = (gender: string): string => {
  return GENDER_COLORS[gender] || '#757575'; // Gris por defecto
};

// Exportar todo para uso en otros componentes
export default {
  DECLENSION_COLORS,
  GENDER_COLORS,
  DECLENSION_INFO,
  getDeclensionColor,
  getGenderColor,
};