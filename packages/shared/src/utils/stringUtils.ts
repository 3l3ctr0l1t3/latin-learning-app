/**
 * STRING UTILITIES FOR LATIN LEARNING APP
 * 
 * Funciones centralizadas para manejo de strings, especialmente importante
 * para búsquedas y comparaciones en latín y español.
 * 
 * IMPORTANTE: Todas las búsquedas y comparaciones en la aplicación deben
 * ser insensibles a mayúsculas/minúsculas y acentos/tildes.
 */

/**
 * NORMALIZE STRING FOR SEARCH
 * 
 * Normaliza un string para búsqueda/comparación eliminando:
 * - Diferencias de mayúsculas/minúsculas
 * - Acentos, tildes y diéresis (á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n)
 * - Espacios extras al inicio y final
 * 
 * @param str - El string a normalizar
 * @returns String normalizado para comparación
 * 
 * EJEMPLOS:
 * - "Rosa" → "rosa"
 * - "ROSA" → "rosa"
 * - "rosā" → "rosa"
 * - "María" → "maria"
 * - "PÚRPURA" → "purpura"
 * - "niño" → "nino"
 * - "pingüino" → "pinguino"
 */
export function normalizeForSearch(str: string): string {
  if (!str) return '';
  
  // Paso 1: Convertir a minúsculas
  let normalized = str.toLowerCase();
  
  // Paso 2: Normalizar usando NFD (Canonical Decomposition)
  // Esto separa los caracteres base de sus marcas diacríticas
  // Ejemplo: "á" se convierte en "a" + "´"
  normalized = normalized.normalize('NFD');
  
  // Paso 3: Eliminar todas las marcas diacríticas
  // \u0300-\u036f incluye todos los combining diacritical marks
  // Esto elimina tildes, acentos, diéresis, macrones, etc.
  normalized = normalized.replace(/[\u0300-\u036f]/g, '');
  
  // Paso 4: Manejar caracteres especiales del español
  // La ñ no se descompone con NFD, así que la manejamos aparte
  normalized = normalized.replace(/ñ/g, 'n');
  
  // Paso 5: Eliminar espacios extras
  normalized = normalized.trim();
  
  return normalized;
}

/**
 * COMPARE STRINGS (CASE AND ACCENT INSENSITIVE)
 * 
 * Compara dos strings ignorando mayúsculas/minúsculas y acentos.
 * Útil para validar respuestas de usuario o buscar coincidencias.
 * 
 * @param str1 - Primer string a comparar
 * @param str2 - Segundo string a comparar
 * @returns true si los strings son equivalentes, false si no
 * 
 * EJEMPLOS:
 * - compareStrings("Rosa", "rosa") → true
 * - compareStrings("María", "MARIA") → true
 * - compareStrings("niño", "nino") → true
 * - compareStrings("César", "cesar") → true
 */
export function compareStrings(str1: string, str2: string): boolean {
  return normalizeForSearch(str1) === normalizeForSearch(str2);
}

/**
 * STRING INCLUDES (CASE AND ACCENT INSENSITIVE)
 * 
 * Verifica si un string contiene otro, ignorando mayúsculas y acentos.
 * Útil para búsquedas parciales y filtrado.
 * 
 * @param haystack - String donde buscar
 * @param needle - String a buscar
 * @returns true si haystack contiene needle (ignorando caso y acentos)
 * 
 * EJEMPLOS:
 * - stringIncludes("Rosa rosae", "rosa") → true
 * - stringIncludes("María tiene", "MARIA") → true
 * - stringIncludes("El niño juega", "nino") → true
 */
export function stringIncludes(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false;
  return normalizeForSearch(haystack).includes(normalizeForSearch(needle));
}

/**
 * STRING STARTS WITH (CASE AND ACCENT INSENSITIVE)
 * 
 * Verifica si un string empieza con otro, ignorando mayúsculas y acentos.
 * Útil para autocompletado y sugerencias.
 * 
 * @param str - String a verificar
 * @param prefix - Prefijo a buscar
 * @returns true si str empieza con prefix (ignorando caso y acentos)
 */
export function stringStartsWith(str: string, prefix: string): boolean {
  if (!str || !prefix) return false;
  return normalizeForSearch(str).startsWith(normalizeForSearch(prefix));
}

/**
 * FUZZY SEARCH SCORE
 * 
 * Calcula un puntaje de similitud entre dos strings.
 * Útil para ordenar resultados de búsqueda por relevancia.
 * 
 * @param searchTerm - Término de búsqueda
 * @param target - String objetivo
 * @returns Puntaje de 0 a 1 (1 = coincidencia perfecta)
 * 
 * PRIORIDADES:
 * 1. Coincidencia exacta = 1.0
 * 2. Empieza con el término = 0.8
 * 3. Contiene el término = 0.5
 * 4. No contiene = 0
 */
export function fuzzySearchScore(searchTerm: string, target: string): number {
  const normalizedSearch = normalizeForSearch(searchTerm);
  const normalizedTarget = normalizeForSearch(target);
  
  // Coincidencia exacta
  if (normalizedSearch === normalizedTarget) return 1.0;
  
  // Empieza con el término
  if (normalizedTarget.startsWith(normalizedSearch)) return 0.8;
  
  // Contiene el término
  if (normalizedTarget.includes(normalizedSearch)) return 0.5;
  
  // No contiene
  return 0;
}

/**
 * HIGHLIGHT SEARCH TERM
 * 
 * Resalta un término de búsqueda en un texto, preservando el caso original.
 * Retorna un array de partes para renderizar con diferentes estilos.
 * 
 * @param text - Texto donde resaltar
 * @param searchTerm - Término a resaltar
 * @returns Array de objetos con texto y si está resaltado
 * 
 * EJEMPLO:
 * highlightSearchTerm("Rosa rosae", "rosa") →
 * [
 *   { text: "Rosa", highlighted: true },
 *   { text: " ", highlighted: false },
 *   { text: "rosae", highlighted: true }
 * ]
 */
export function highlightSearchTerm(
  text: string, 
  searchTerm: string
): Array<{ text: string; highlighted: boolean }> {
  if (!text || !searchTerm) {
    return [{ text: text || '', highlighted: false }];
  }
  
  const normalizedText = normalizeForSearch(text);
  const normalizedSearch = normalizeForSearch(searchTerm);
  const parts: Array<{ text: string; highlighted: boolean }> = [];
  
  let lastIndex = 0;
  let index = normalizedText.indexOf(normalizedSearch);
  
  while (index !== -1) {
    // Agregar texto antes del match
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        highlighted: false
      });
    }
    
    // Agregar texto resaltado
    parts.push({
      text: text.substring(index, index + searchTerm.length),
      highlighted: true
    });
    
    lastIndex = index + searchTerm.length;
    index = normalizedText.indexOf(normalizedSearch, lastIndex);
  }
  
  // Agregar texto restante
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false
    });
  }
  
  return parts;
}

// Exportar todas las funciones
export default {
  normalizeForSearch,
  compareStrings,
  stringIncludes,
  stringStartsWith,
  fuzzySearchScore,
  highlightSearchTerm
};