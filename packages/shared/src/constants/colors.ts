/**
 * DECLENSION COLOR SYSTEM
 * 
 * Colores armonizados para las 5 declinaciones latinas.
 * Sistema basado en teoría del color para máxima armonía y accesibilidad.
 * 
 * CONCEPTOS DE DISEÑO:
 * 1. Esquema Análogo-Complementario: Basado en púrpura con acentos cálidos
 * 2. Progresión Visual: De colores fríos a cálidos (1ª→5ª)
 * 3. Accesibilidad: Contraste mínimo 3:1 en fondo oscuro
 * 4. Armonía: Todos los colores comparten saturación similar
 */

/**
 * PALETA DE COLORES PARA DECLINACIONES
 * 
 * Estrategia de Color:
 * - Basada en el púrpura principal (#BB86FC) del tema
 * - Usa esquema análogo con toques complementarios
 * - Progresión de frío a cálido para ayudar memorización
 * - Saturación unificada para coherencia visual
 */
export const DECLENSION_COLORS = {
  /**
   * 1ª DECLINACIÓN - VIOLETA
   * Color base derivado del púrpura principal
   * Ligeramente más azulado para comenzar la progresión
   */
  '1st': {
    main: '#A78BFA',      // Violet-400 - Más azulado que el púrpura principal
    light: '#C4B5FD',     // Para hover/estados activos
    dark: '#8B5CF6',      // Para bordes/énfasis
    contrast: '#FFFFFF',   // Texto sobre el color
    rgb: '167, 139, 250'  // Para transparencias con alpha
  },
  
  /**
   * 2ª DECLINACIÓN - AZUL ÍNDIGO
   * Transición natural desde violeta
   * Mantiene la familia de colores fríos
   */
  '2nd': {
    main: '#818CF8',      // Indigo-400 - Azul con toque púrpura
    light: '#A5B4FC',     // Indigo-300
    dark: '#6366F1',      // Indigo-500
    contrast: '#FFFFFF',
    rgb: '129, 140, 248'
  },
  
  /**
   * 3ª DECLINACIÓN - CYAN
   * Centro del espectro, color puente
   * Relacionado con el cyan del tema pero más vibrante
   */
  '3rd': {
    main: '#22D3EE',      // Cyan-400 - Vibrante y distintivo
    light: '#67E8F9',     // Cyan-300
    dark: '#06B6D4',      // Cyan-500
    contrast: '#000000',   // Texto oscuro para mejor contraste
    rgb: '34, 211, 238'
  },
  
  /**
   * 4ª DECLINACIÓN - ÁMBAR
   * Transición a colores cálidos
   * Conecta con el color secundario del tema
   */
  '4th': {
    main: '#FBD38D',      // Amber-300 - Dorado suave
    light: '#FEF3C7',     // Amber-100
    dark: '#F59E0B',      // Amber-500
    contrast: '#000000',
    rgb: '251, 211, 141'
  },
  
  /**
   * 5ª DECLINACIÓN - ROSA CORAL
   * Final cálido del espectro
   * Complementario al cyan de la 3ª declinación
   */
  '5th': {
    main: '#FDA4AF',      // Rose-300 - Rosa coral suave
    light: '#FECDD3',     // Rose-200
    dark: '#FB7185',      // Rose-400
    contrast: '#000000',
    rgb: '253, 164, 175'
  }
} as const;

/**
 * FUNCIONES AUXILIARES PARA COLORES
 */

/**
 * Obtiene el color principal de una declinación
 * @param declension - Número de declinación ('1st', '2nd', etc.)
 * @returns Color hex o fallback gris
 */
export function getDeclensionColor(declension: string): string {
  return DECLENSION_COLORS[declension as keyof typeof DECLENSION_COLORS]?.main || '#9E9E9E';
}

/**
 * Obtiene el color con transparencia
 * @param declension - Número de declinación
 * @param alpha - Valor de transparencia (0-1)
 * @returns Color rgba string
 */
export function getDeclensionColorAlpha(declension: string, alpha: number = 0.2): string {
  const color = DECLENSION_COLORS[declension as keyof typeof DECLENSION_COLORS];
  if (!color) return `rgba(158, 158, 158, ${alpha})`;
  return `rgba(${color.rgb}, ${alpha})`;
}

/**
 * Obtiene todos los colores de una declinación
 * @param declension - Número de declinación
 * @returns Objeto con todos los tonos o colores por defecto
 */
export function getDeclensionColorSet(declension: string) {
  return DECLENSION_COLORS[declension as keyof typeof DECLENSION_COLORS] || {
    main: '#9E9E9E',
    light: '#BDBDBD',
    dark: '#757575',
    contrast: '#FFFFFF',
    rgb: '158, 158, 158'
  };
}

/**
 * INFORMACIÓN ADICIONAL SOBRE EL SISTEMA DE COLORES
 * 
 * Por qué estos colores:
 * 
 * 1. PROGRESIÓN ESPECTRAL (Violeta → Rosa):
 *    - Ayuda a la memorización mediante asociación visual
 *    - Crea una narrativa visual de "más frío" a "más cálido"
 *    - Similar al espectro del arcoíris, familiar y fácil de recordar
 * 
 * 2. ARMONÍA CON EL TEMA:
 *    - Violeta e Índigo: Análogos al púrpura principal (#BB86FC)
 *    - Cyan: Proporciona contraste manteniendo armonía
 *    - Ámbar: Conecta con el color secundario (#FFA726)
 *    - Rosa: Completa el círculo cromático
 * 
 * 3. ACCESIBILIDAD:
 *    - Todos los colores tienen suficiente contraste en fondo oscuro
 *    - Colores distinguibles para la mayoría de tipos de daltonismo
 *    - Luminosidad variada para diferenciación sin depender solo del matiz
 * 
 * 4. CONSISTENCIA:
 *    - Saturación similar en todos los colores (excepto cyan para énfasis)
 *    - Peso visual equilibrado
 *    - Ningún color domina excesivamente sobre los otros
 * 
 * 5. MEMORIZACIÓN:
 *    - 1ª y 2ª (violeta/índigo): Colores "nobles" para declinaciones comunes
 *    - 3ª (cyan): Color distintivo para la declinación más compleja
 *    - 4ª y 5ª (ámbar/rosa): Colores cálidos para las menos frecuentes
 */

/**
 * PALETA ALTERNATIVA (MODO ALTO CONTRASTE)
 * Para usuarios que necesiten mayor diferenciación
 */
export const DECLENSION_COLORS_HIGH_CONTRAST = {
  '1st': '#E879F9',  // Fuchsia brillante
  '2nd': '#3B82F6',  // Azul puro
  '3rd': '#10B981',  // Verde esmeralda
  '4th': '#F59E0B',  // Naranja
  '5th': '#EF4444',  // Rojo
} as const;

// Exportar tipo para TypeScript
export type DeclensionColorKey = keyof typeof DECLENSION_COLORS;