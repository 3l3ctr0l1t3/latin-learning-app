/**
 * WORD SELECTION STEP COMPONENT
 * 
 * Componente simplificado para selección de palabras.
 * Integra búsqueda y visualización en una interfaz compacta.
 * 
 * CONCEPTOS IMPORTANTES PARA APRENDER:
 * 
 * 1. COMPONENTE COMPUESTO (Composite Component):
 *    - Combina múltiples componentes menores en uno más grande
 *    - Como construir con LEGO: piezas pequeñas forman algo más complejo
 *    - Reutiliza componentes existentes (WordSearchDropdown)
 * 
 * 2. INTERFAZ COMPACTA:
 *    - Evita redundancia mostrando información una sola vez
 *    - WordSearchDropdown ya muestra las palabras seleccionadas
 *    - Mantiene todo visible sin necesidad de scroll
 */

import React from 'react';
import {
  Box,           // Contenedor flexible - como un div mejorado
  Typography,    // Componente para todo tipo de texto
  Button,        // Botón interactivo
} from '@mui/material';

// Iconos
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Componentes
import WordSearchDropdown from '../search/WordSearchDropdown';
import type { LatinWord } from '../../../../components/global/WordCard';

// Servicio de vocabulario para obtener palabras aleatorias
// Importamos la instancia singleton en lugar de la clase
// Esto evita crear múltiples instancias y el mensaje "Loaded 690 words" apareciendo varias veces
import { vocabularyService } from '@latin-app/data';

/**
 * PROPS DEL COMPONENTE
 * 
 * Props = Properties (Propiedades) - Datos que recibe el componente del padre
 * Es como los parámetros de una función en Java, pero para componentes React
 * 
 * IMPORTANTE: Las props son READ-ONLY (solo lectura)
 * No puedes modificar props directamente, solo usarlas
 */
interface WordSelectionStepProps {
  // Array de palabras actualmente seleccionadas
  // Este dato viene del componente padre, no lo manejamos aquí
  selectedWords: LatinWord[];
  
  // Función callback - se ejecuta cuando cambia la selección
  // El padre nos da esta función para que le avisemos de cambios
  // Es como un event listener: "cuando pase esto, ejecuta esta función"
  onSelectionChange: (words: LatinWord[]) => void;
  
  // Mínimo de palabras requeridas para continuar
  // El ? significa que es opcional - si no se proporciona, usamos el valor por defecto
  minWords?: number;
  
  // Máximo de palabras permitidas en la selección
  // También opcional - limitamos cuántas palabras puede seleccionar el usuario
  maxWords?: number;
}

/**
 * COMPONENTE WORD SELECTION STEP (SIMPLIFICADO)
 * 
 * Versión compacta que:
 * - Integra búsqueda y selección en una sola tarjeta
 * - Muestra el estado de validación en línea
 * - Incluye botón de selección aleatoria
 * - Delega la visualización de palabras seleccionadas al WordSearchDropdown
 * 
 * PATRÓN DE COMPONENTE FUNCIONAL:
 * const NombreComponente: React.FC<Props> = (props) => { ... }
 * - React.FC = Function Component (Componente Funcional)
 * - <Props> = El tipo de las props (TypeScript)
 * - Los props se desestructuran en los parámetros { prop1, prop2 }
 */
const WordSelectionStep: React.FC<WordSelectionStepProps> = ({
  selectedWords,      // Array de palabras seleccionadas (viene del padre)
  onSelectionChange,  // Función para avisar al padre de cambios
  minWords = 5,       // Valor por defecto: mínimo 5 palabras
  maxWords = 30,      // Valor por defecto: máximo 30 palabras
}) => {
  // SERVICIO DE VOCABULARIO
  // Ya no necesitamos crear una instancia local - usamos el singleton importado
  // vocabularyService está disponible directamente desde el import
  // Esto evita múltiples mensajes de "Loaded 690 words" en la consola

  // VALIDACIONES BOOLEANAS
  // isComplete: ¿Ya seleccionó el mínimo de palabras?
  const isComplete = selectedWords.length >= minWords;
  
  // isFull: ¿Ya llegó al máximo permitido?
  const isFull = selectedWords.length >= maxWords;

  /**
   * MANEJADOR: SELECCIÓN ALEATORIA DE PALABRAS
   * 
   * Handler = Manejador - Función que responde a un evento del usuario
   * En este caso, cuando el usuario hace click en "Seleccionar aleatorias"
   */
  const handleRandomSelection = () => {
    // Obtener 20 palabras aleatorias del servicio
    const randomWords = vocabularyService.getRandomWords(20);
    
    // Avisar al componente padre del cambio
    // Esto ejecuta la función que el padre nos pasó en props
    onSelectionChange(randomWords);
  };

  // RETURN DEL COMPONENTE
  // Todo componente React debe retornar JSX (JavaScript XML)
  // JSX es como HTML pero con superpoderes de JavaScript
  return (
    // CONTENEDOR PRINCIPAL SIN WRAPPER EXTRA
    // Usamos Box directamente sin anidación innecesaria
    <Box 
      data-testid="word-selection-step"
      sx={{ 
      pt: 0,    // padding-top: 0 para maximizar espacio vertical
      px: 0,    // Sin padding horizontal extra
      pb: 2,    // padding-bottom: 16px
    }}>
      {/* ENCABEZADO CON TÍTULO Y ACCIÓN RÁPIDA */}
      {/* display: 'flex' crea un contenedor flexible (flexbox) */}
      {/* alignItems: 'center' alinea verticalmente al centro */}
      <Box 
        data-testid="word-selection-header"
        sx={{ display: 'flex', alignItems: 'center', pt: 0, mb: 1.5 }}>
        {/* Typography maneja todo el texto con estilos consistentes */}
        {/* flexGrow: 1 hace que este elemento ocupe todo el espacio disponible */}
        <Typography 
          data-testid="word-selection-title"
          variant="h6" 
          sx={{ 
          flexGrow: 1, 
          color: 'primary.main',  // Usar púrpura del tema para mejor visibilidad
          fontWeight: 'medium'
        }}>
          🔍 Paso 1: Buscar y Seleccionar Palabras
        </Typography>
        
        {/* BOTÓN DE SELECCIÓN ALEATORIA */}
        {/* Solo se muestra si no está lleno */}
        {!isFull && (
          <Button
            data-testid="random-selection-button"
            startIcon={<AutoAwesomeIcon />}  // Icono a la izquierda del texto
            variant="outlined"                // Solo borde, sin relleno
            size="small"                      // Tamaño reducido
            onClick={handleRandomSelection}   // Función a ejecutar al hacer click
          >
            20 Aleatorias
          </Button>
        )}
      </Box>
      
      {/* ESTADO DE VALIDACIÓN */}
      {/* Solo mostrar el estado, no las instrucciones (ya están en el placeholder) */}
      {(selectedWords.length > 0 || !isComplete) && (
        <Typography 
          data-testid="validation-status"
          variant="body2" 
          sx={{ mb: 1 }}>
          {/* RENDERIZADO CONDICIONAL para mostrar el estado */}
          {!isComplete && (
            // Si NO está completo, mostrar cuántas faltan
            <Typography 
              component="span"  // span = elemento en línea (no rompe la línea)
              color="warning.main" 
              sx={{ fontWeight: 'bold' }}
            >
              {/* Template literal con ${} para insertar variables */}
              Necesitas al menos {minWords - selectedWords.length} palabra{minWords - selectedWords.length !== 1 ? 's' : ''} más.
            </Typography>
          )}
          {isComplete && !isFull && (
            // Si está completo pero no lleno, mostrar éxito
            // Usamos el color secundario (cyan) que combina mejor con el tema
            <Typography 
              component="span" 
              color="secondary.main" 
              sx={{ fontWeight: 'bold' }}
            >
              ✓ Listo para continuar
            </Typography>
          )}
          {isFull && (
            // Si está lleno, mostrar límite alcanzado
            <Typography 
              component="span" 
              color="info.main" 
              sx={{ fontWeight: 'bold' }}
            >
              Has alcanzado el máximo de {maxWords} palabras
            </Typography>
          )}
        </Typography>
      )}

      {/* COMPONENTE DE BÚSQUEDA Y SELECCIÓN */}
      {/* WordSearchDropdown maneja todo: búsqueda, dropdown, y visualización de seleccionadas */}
      {/* No necesitamos duplicar la visualización de palabras seleccionadas */}
      <WordSearchDropdown
        data-testid="word-search-dropdown"
        selectedWords={selectedWords}        // Le pasamos el array actual
        onSelectionChange={onSelectionChange} // Le pasamos la función callback
        maxSelection={maxWords}              // Límite máximo
        // No necesitamos pasar placeholder, usa el por defecto del componente
      />
    </Box>
  );
};

export default WordSelectionStep;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. COMPONENTE SIMPLIFICADO:
 *    - Evita duplicación de información
 *    - Delega responsabilidades a componentes hijos
 *    - Mantiene la interfaz compacta y sin scroll
 * 
 * 2. RENDERIZADO CONDICIONAL:
 *    - Muestra diferentes mensajes según el estado
 *    - Usa && para mostrar/ocultar elementos
 *    - Operador ternario para elegir entre opciones
 * 
 * 3. COMPOSICIÓN EFICIENTE:
 *    - Un solo Paper para todo el contenido
 *    - Estado integrado en el texto descriptivo
 *    - Acción rápida en el encabezado
 * 
 * 4. REUTILIZACIÓN:
 *    - WordSearchDropdown maneja su propia complejidad
 *    - Este componente solo orquesta y añade funcionalidad extra
 *    - Mantiene responsabilidades claras y separadas
 */