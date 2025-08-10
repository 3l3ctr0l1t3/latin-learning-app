/**
 * COLORES CENTRALIZADOS PARA LA APLICACIÓN
 * 
 * Este archivo define todos los colores que se usan consistentemente
 * en toda la aplicación de Latin Learning. Centralizar los colores
 * asegura consistencia visual y facilita cambios futuros.
 * 
 * IMPORTANTE: Los colores ahora vienen del archivo theme.ts para
 * mantener toda la configuración visual en un solo lugar.
 */

// Importamos los colores desde el tema centralizado
// Usamos ruta relativa porque el alias @ no está configurado
import { LATIN_COLORS } from '../../../config/theme';

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
 * 
 * Estos colores ahora vienen del tema centralizado
 */
export const DECLENSION_COLORS: Record<string, string> = LATIN_COLORS.declensions;

/**
 * COLORES POR GÉNERO
 * 
 * Aunque ahora priorizamos colores por declinación,
 * mantenemos estos para casos específicos donde el género
 * sea más relevante que la declinación.
 * 
 * Estos colores ahora vienen del tema centralizado
 */
export const GENDER_COLORS: Record<string, string> = LATIN_COLORS.genders;

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
  return DECLENSION_COLORS[declension] || LATIN_COLORS.default; // Usa el gris por defecto del tema
};

/**
 * FUNCIÓN HELPER: Obtener color por género
 * 
 * @param gender - El género (masculine, feminine, neuter)
 * @returns El color hexadecimal correspondiente
 */
export const getGenderColor = (gender: string): string => {
  return GENDER_COLORS[gender] || LATIN_COLORS.default; // Usa el gris por defecto del tema
};

// Exportar todo para uso en otros componentes
export default {
  DECLENSION_COLORS,
  GENDER_COLORS,
  DECLENSION_INFO,
  getDeclensionColor,
  getGenderColor,
};