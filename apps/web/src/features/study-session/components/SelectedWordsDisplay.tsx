/**
 * SELECTED WORDS DISPLAY COMPONENT
 * 
 * Componente reutilizable para mostrar palabras seleccionadas.
 * Incluye un botón de limpiar todo como encabezado y los chips de palabras.
 * 
 * CONCEPTOS IMPORTANTES PARA APRENDER:
 * 
 * 1. COMPONENTE DE PRESENTACIÓN (Presentational Component):
 *    - Solo se encarga de mostrar datos, no de manejarlos
 *    - Recibe datos y callbacks a través de props
 *    - Altamente reutilizable en diferentes contextos
 * 
 * 2. COMPOSICIÓN:
 *    - Usa SelectedWordChip para cada palabra individual
 *    - Añade funcionalidad de "limpiar todo" encima
 *    - Mantiene responsabilidad única: mostrar palabras seleccionadas
 */

import React from 'react';
import {
  Box,      // Contenedor flexible
  Button,   // Botón para limpiar todo
  useMediaQuery,  // Hook para detectar tamaño de pantalla
  useTheme,       // Hook para acceder al tema
} from '@mui/material';

// Iconos
import ClearAllIcon from '@mui/icons-material/ClearAll';

// Componentes
import SelectedWordChip from './SelectedWordChip';
import type { LatinWord } from './WordCard';

/**
 * PROPS DEL COMPONENTE
 * 
 * Define qué datos necesita este componente para funcionar
 */
interface SelectedWordsDisplayProps {
  // Array de palabras seleccionadas para mostrar
  selectedWords: LatinWord[];
  
  // Callback cuando se elimina una palabra individual
  // Recibe el ID de la palabra a eliminar
  onRemoveWord: (wordId: string) => void;
  
  // Callback cuando se limpian todas las palabras
  onClearAll: () => void;
  
  // Callback opcional cuando se hace click en una palabra
  onWordClick?: (word: LatinWord) => void;
  
  // Texto personalizado para el botón de limpiar
  clearButtonText?: string;
  
  // Mostrar tooltips en los chips
  showTooltips?: boolean;
  
  // Colorear chips por declinación
  colorByDeclension?: boolean;
}

/**
 * COMPONENTE SELECTED WORDS DISPLAY
 * 
 * Muestra una lista de palabras seleccionadas con:
 * - Botón de limpiar todo como encabezado
 * - Chips individuales para cada palabra
 * - Opción de eliminar palabras individuales
 * 
 * Este componente NO maneja el estado, solo lo muestra.
 * El componente padre es responsable de manejar los cambios.
 */
const SelectedWordsDisplay: React.FC<SelectedWordsDisplayProps> = ({
  selectedWords,           // Palabras a mostrar
  onRemoveWord,            // Función para eliminar una palabra
  onClearAll,              // Función para limpiar todo
  onWordClick,             // Función opcional para clicks
  clearButtonText,         // Texto del botón (personalizable)
  showTooltips = true,     // Mostrar tooltips por defecto
  colorByDeclension = true // Colorear por declinación por defecto
}) => {
  // DETECCIÓN DE MÓVIL
  // Usamos hooks de MUI para detectar el tamaño de pantalla
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true si es móvil
  
  // Si no hay palabras seleccionadas, no mostrar nada
  // Retorno temprano (early return) para simplificar el código
  if (selectedWords.length === 0) {
    return null;
  }

  // Construir el texto del botón de limpiar
  // Si no se proporciona texto personalizado, usar el por defecto
  const buttonText = clearButtonText || `Limpiar (${selectedWords.length} palabra${selectedWords.length !== 1 ? 's' : ''})`;

  return (
    <Box sx={{ mt: 2 }}>
      {/* BOTÓN DE LIMPIAR TODO COMO ENCABEZADO */}
      {/* Actúa como título y acción al mismo tiempo */}
      <Button
        variant="text"              // Sin borde, estilo sutil
        color="error"               // Color rojo para indicar acción destructiva
        size="small"                // Tamaño compacto
        startIcon={<ClearAllIcon />} // Icono a la izquierda
        onClick={onClearAll}        // Ejecutar callback al hacer click
        sx={{ 
          mb: 1.5,                  // margin-bottom: 12px (1.5 * 8)
          p: 0.5,                   // padding: 4px (0.5 * 8)
          minWidth: 'auto',         // No forzar ancho mínimo
          textTransform: 'none',    // No convertir a mayúsculas
          fontSize: '0.875rem',     // Tamaño de fuente pequeño
          border: '1px solid transparent',  // Borde transparente inicial para evitar saltos
          borderRadius: 1,          // Esquinas ligeramente redondeadas
          transition: 'border-color 0.2s ease',  // Transición suave del borde
          '&:hover': {
            // Borde rojo fino al pasar el mouse, sin cambio de fondo
            borderColor: 'error.main',
            backgroundColor: 'transparent',
          }
        }}
      >
        {buttonText}
      </Button>
      
      {/* CONTENEDOR DE CHIPS DE PALABRAS */}
      {/* Flexbox normal con wrap mostrando todas las palabras sin límite de altura */}
      <Box sx={{ 
        display: 'flex',      // Contenedor flexible
        flexWrap: 'wrap',     // Siempre permitir wrap
        gap: 1,               // Espacio entre chips (8px)
      }}>
        {/* MAP: Crear un chip por cada palabra */}
        {/* Mostramos TODAS las palabras sin scroll, el wrap las acomoda automáticamente */}
        {selectedWords.map((word) => (
          <SelectedWordChip
            key={word.id}
            word={word}                      // Datos de la palabra
            variant={isMobile ? "compact" : "default"}  // Usar variante compacta en móvil
            showTooltip={showTooltips}       // Mostrar/ocultar tooltip
            colorByDeclension={colorByDeclension} // Colorear por declinación
            
            // Callback para eliminar esta palabra específica
            onDelete={() => onRemoveWord(word.id)}
            
            // Callback opcional para clicks (si se proporciona)
            onClick={onWordClick ? () => onWordClick(word) : undefined}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SelectedWordsDisplay;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. COMPONENTE DE PRESENTACIÓN:
 *    - No tiene estado propio (stateless)
 *    - Solo recibe props y renderiza UI
 *    - Delega todas las acciones a callbacks
 * 
 * 2. PROPS OPCIONALES:
 *    - Uso de ? para props opcionales
 *    - Valores por defecto con =
 *    - Personalización flexible
 * 
 * 3. RETORNO TEMPRANO:
 *    - if (condition) return null
 *    - Evita renderizar cuando no hay datos
 *    - Simplifica la lógica del componente
 * 
 * 4. COMPOSICIÓN:
 *    - Reutiliza SelectedWordChip
 *    - Añade funcionalidad adicional (limpiar todo)
 *    - Mantiene responsabilidad única
 * 
 * 5. DISEÑO RESPONSIVO:
 *    - useMediaQuery para detectar móvil
 *    - Muestra todas las palabras con wrap natural
 *    - Variante compacta de chips en móvil para ahorrar espacio
 */