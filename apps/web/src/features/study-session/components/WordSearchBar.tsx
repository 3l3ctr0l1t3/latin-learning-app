/**
 * WORD SEARCH BAR COMPONENT
 * 
 * Barra de búsqueda para filtrar palabras del vocabulario latino.
 * Este es un componente "controlado" - el padre maneja el estado del valor.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Input Adornments: Elementos decorativos en inputs (iconos, botones)
 * - Controlled Components: El valor viene de props, no estado interno
 * - Debouncing: Técnica para retrasar ejecución hasta que el usuario pare de escribir
 */

import React, { useState, useEffect } from 'react';
import {
  TextField,          // Input de texto de MUI
  InputAdornment,    // Para añadir iconos dentro del input
  IconButton,        // Botón que solo muestra un icono
  Box,              // Contenedor flexible
  Typography,       // Para texto
  Fade,             // Animación de aparición/desaparición
} from '@mui/material';

// Iconos para la barra de búsqueda
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * PROPS DEL COMPONENTE
 * 
 * value: El texto actual en la barra de búsqueda
 * onChange: Callback cuando cambia el texto
 * placeholder: Texto de ayuda cuando está vacío
 * onClear: Callback opcional cuando se limpia la búsqueda
 * disabled: Si la barra está deshabilitada
 * helperText: Texto de ayuda debajo de la barra
 */
interface WordSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  disabled?: boolean;
  helperText?: string;
  // Prop para activar debouncing (retraso en búsqueda)
  debounceMs?: number;
}

/**
 * COMPONENTE WORD SEARCH BAR
 * 
 * Una barra de búsqueda elegante con:
 * - Icono de búsqueda a la izquierda
 * - Botón de limpiar a la derecha (aparece cuando hay texto)
 * - Soporte para debouncing opcional
 * - Animaciones suaves
 */
const WordSearchBar: React.FC<WordSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar palabras en latín o español...', // Valor por defecto
  onClear,
  disabled = false,
  helperText,
  debounceMs = 0, // Sin debounce por defecto
}) => {
  /**
   * ESTADO LOCAL PARA DEBOUNCING
   * 
   * Debouncing es una técnica que retrasa la ejecución de una función
   * hasta que pase un tiempo sin que se vuelva a llamar.
   * 
   * Útil para búsquedas: evita buscar con cada letra que escribe el usuario
   * 
   * Si debounceMs > 0, usamos estado local para el valor inmediato
   * y solo llamamos onChange después del retraso
   */
  const [localValue, setLocalValue] = useState(value);

  /**
   * USE EFFECT PARA DEBOUNCING
   * 
   * useEffect es un Hook que ejecuta código cuando cambian dependencias
   * En este caso, cuando cambia localValue
   * 
   * CONCEPTOS:
   * - Hook: Función especial de React que añade funcionalidad a componentes
   * - useEffect: Hook para efectos secundarios (timers, llamadas API, etc.)
   * - Cleanup: La función que retorna se ejecuta al limpiar
   */
  useEffect(() => {
    // Si no hay debounce, no hacer nada
    if (debounceMs <= 0) return;

    // Crear un timer que ejecute onChange después del retraso
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    // Cleanup: cancelar el timer si el componente se desmonta
    // o si localValue cambia antes de que termine el timer
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  /**
   * MANEJADOR DE CAMBIOS EN EL INPUT
   * 
   * Si hay debounce, actualiza el estado local
   * Si no, llama directamente a onChange
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (debounceMs > 0) {
      setLocalValue(newValue); // Actualizar estado local para debouncing
    } else {
      onChange(newValue); // Llamar directamente al callback
    }
  };

  /**
   * MANEJADOR PARA LIMPIAR LA BÚSQUEDA
   * Limpia tanto el valor local como llama al callback del padre
   */
  const handleClear = () => {
    if (debounceMs > 0) {
      setLocalValue('');
    }
    onChange('');
    
    // Llamar al callback onClear si existe
    if (onClear) {
      onClear();
    }
  };

  /**
   * SINCRONIZAR VALOR EXTERNO CON ESTADO LOCAL
   * Si el padre cambia el valor, actualizar el estado local
   */
  useEffect(() => {
    if (debounceMs > 0) {
      setLocalValue(value);
    }
  }, [value, debounceMs]);

  // Determinar qué valor mostrar (local si hay debounce, prop si no)
  const displayValue = debounceMs > 0 ? localValue : value;

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth // Ocupa todo el ancho disponible
        variant="outlined" // Estilo con borde
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        // InputProps permite personalizar el input interno
        InputProps={{
          // Icono de búsqueda al inicio (izquierda)
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  color: disabled ? 'text.disabled' : 'action.active' 
                }} 
              />
            </InputAdornment>
          ),
          // Botón de limpiar al final (derecha) - solo si hay texto
          endAdornment: displayValue && (
            <InputAdornment position="end">
              {/* Fade añade animación de aparición/desaparición */}
              <Fade in={Boolean(displayValue)}>
                <IconButton
                  aria-label="limpiar búsqueda" // Accesibilidad
                  onClick={handleClear}
                  edge="end" // Quita padding extra en el borde
                  disabled={disabled}
                  size="small"
                  sx={{
                    // Animación en hover
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'error.main', // Rojo en hover
                      transform: 'scale(1.1)', // Ligeramente más grande
                    }
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Fade>
            </InputAdornment>
          ),
        }}
        // Estilos personalizados
        sx={{
          // Personalizar el input cuando está enfocado
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              }
            },
            // Animación suave para el borde
            transition: 'all 0.3s ease',
          },
          // Color del placeholder
          '& .MuiInputBase-input::placeholder': {
            color: 'text.secondary',
            opacity: 0.7,
          }
        }}
      />
      
      {/* TEXTO DE AYUDA */}
      {helperText && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            mt: 1, // margin-top
            ml: 2, // margin-left para alinear con el contenido del input
            color: 'text.secondary' 
          }}
        >
          {helperText}
        </Typography>
      )}

      {/* INDICADOR DE BÚSQUEDA ACTIVA */}
      {displayValue && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            mt: 0.5,
            ml: 2,
            color: 'info.main' 
          }}
        >
          Buscando: "{displayValue}"
          {debounceMs > 0 && displayValue !== value && (
            <span style={{ marginLeft: 8, opacity: 0.7 }}>
              (esperando...)
            </span>
          )}
        </Typography>
      )}
    </Box>
  );
};

// Exportar el componente
export default WordSearchBar;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. INPUT ADORNMENTS:
 *    - startAdornment: Elementos al inicio del input (iconos, prefijos)
 *    - endAdornment: Elementos al final (botones, sufijos)
 *    - Útiles para añadir funcionalidad visual sin romper el diseño
 * 
 * 2. DEBOUNCING:
 *    - Técnica para retrasar la ejecución de funciones costosas
 *    - Evita llamadas excesivas (ej: búsquedas en cada tecla)
 *    - Usa setTimeout y clearTimeout para manejar retrasos
 * 
 * 3. CONTROLLED vs UNCONTROLLED:
 *    - Controlled: El valor viene de props, el padre maneja el estado
 *    - Uncontrolled: El componente maneja su propio estado
 *    - Controlled es preferible para formularios complejos
 * 
 * 4. useEffect HOOK:
 *    - Ejecuta código cuando cambian dependencias
 *    - Puede retornar una función de limpieza
 *    - Útil para timers, suscripciones, llamadas API
 * 
 * 5. ANIMACIONES EN MUI:
 *    - Fade: Aparición/desaparición gradual
 *    - Transitions CSS: Cambios suaves de propiedades
 *    - transform: scale() para efectos de zoom
 * 
 * 6. ACCESIBILIDAD:
 *    - aria-label: Describe elementos para lectores de pantalla
 *    - Importante para usuarios con discapacidades visuales
 */