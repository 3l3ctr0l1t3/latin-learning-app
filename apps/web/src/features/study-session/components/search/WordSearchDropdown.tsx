/**
 * WORD SEARCH DROPDOWN COMPONENT
 * 
 * Componente de búsqueda con dropdown para selección múltiple de palabras latinas.
 * Combina un campo de búsqueda con un dropdown de resultados y visualización
 * de palabras seleccionadas.
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * - Búsqueda con debouncing (300ms) para optimizar rendimiento
 * - Dropdown con chips coloreados por declinación
 * - Selección múltiple sin cerrar el dropdown
 * - Visualización de palabras seleccionadas con opción de eliminar
 * - Prevención de apertura del dropdown al eliminar palabras
 * 
 * FLUJO DE DATOS:
 * 1. Usuario escribe → debouncing → búsqueda en vocabulario
 * 2. Resultados filtrados (excluye palabras ya seleccionadas)
 * 3. Click en chip → añade a selección
 * 4. Click en X → elimina de selección (sin abrir dropdown)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  Popper,
  InputAdornment,
  IconButton,
  Typography,
  ClickAwayListener,
  Fade,
} from '@mui/material';

// Iconos
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Tipos y componentes internos
import type { LatinWord } from '../../../../components/global/WordCard';
import SelectedWordChip from '../../../../components/global/SelectedWordChip';
import SelectedWordsDisplay from '../config/SelectedWordsDisplay';

// Servicio de datos
// Importamos la instancia singleton en lugar de la clase
// Esto evita crear múltiples instancias y el mensaje "Loaded 690 words" apareciendo varias veces
import { vocabularyService } from '@latin-app/data';

/**
 * PROPS DEL COMPONENTE
 */
interface WordSearchDropdownProps {
  selectedWords: LatinWord[];                      // Palabras actualmente seleccionadas
  onSelectionChange: (words: LatinWord[]) => void; // Callback para cambios en selección
  maxSelection?: number;                           // Máximo de palabras permitidas
  placeholder?: string;                            // Texto del placeholder (ya no se usa)
  disabled?: boolean;                              // Estado deshabilitado
}

/**
 * COMPONENTE PRINCIPAL
 */
const WordSearchDropdown: React.FC<WordSearchDropdownProps> = ({
  selectedWords,
  onSelectionChange,
  maxSelection = 20,
  disabled = false
}) => {
  // ============================================================================
  // ESTADOS
  // ============================================================================
  
  // Texto de búsqueda y su versión con debounce
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  
  // Control del dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [filteredWords, setFilteredWords] = useState<LatinWord[]>([]);
  
  // Flag para prevenir apertura del dropdown al eliminar palabras
  const [isRemovingWord, setIsRemovingWord] = useState(false);
  
  // ============================================================================
  // REFERENCIAS DOM
  // ============================================================================
  
  const textFieldRef = useRef<HTMLDivElement>(null); // Para anclar el Popper
  const inputRef = useRef<HTMLInputElement>(null);   // Para focus programático
  
  // ============================================================================
  // SERVICIOS
  // ============================================================================
  
  // Ya no necesitamos crear una instancia local - usamos el singleton importado
  // vocabularyService está disponible directamente desde el import
  // Esto evita múltiples mensajes de "Loaded 690 words" en la consola
  
  // ============================================================================
  // EFECTOS
  // ============================================================================
  
  /**
   * EFECTO: Debouncing del texto de búsqueda
   * Retrasa la búsqueda 300ms para no buscar en cada tecla
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  /**
   * EFECTO: Búsqueda y filtrado de palabras
   * Se ejecuta cuando cambia el texto con debounce o la selección
   */
  useEffect(() => {
    // No hacer nada si estamos eliminando palabras
    if (isRemovingWord) {
      return;
    }
    
    // Limpiar si no hay suficiente texto
    if (debouncedSearchText.trim().length < 2) {
      setFilteredWords([]);
      setIsOpen(false);
      return;
    }

    // Buscar en el vocabulario
    const results = vocabularyService.searchWords(debouncedSearchText);
    
    // Filtrar palabras ya seleccionadas (usando Set para O(1) lookup)
    const selectedIds = new Set(selectedWords.map(w => w.id));
    const availableResults = results.filter(word => !selectedIds.has(word.id));
    
    // Limitar resultados y actualizar estado
    setFilteredWords(availableResults.slice(0, 20));
    
    // Nota: NO abrimos el dropdown automáticamente aquí
    // El dropdown se abre solo cuando el usuario interactúa
  }, [debouncedSearchText, vocabularyService, selectedWords, isRemovingWord]);

  // ============================================================================
  // MANEJADORES DE EVENTOS
  // ============================================================================
  
  /**
   * Maneja cambios en el campo de búsqueda
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    
    // Abrir dropdown si hay suficiente texto y no estamos eliminando
    if (value.length >= 2 && !isRemovingWord) {
      setIsOpen(true);
    }
  };

  /**
   * Maneja la selección de una palabra del dropdown
   */
  const handleWordSelect = (word: LatinWord) => {
    if (selectedWords.length < maxSelection) {
      onSelectionChange([...selectedWords, word]);
    }
    // No cerrar el dropdown para permitir selección múltiple
  };

  /**
   * Maneja eventos de teclado
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (event.key === 'ArrowDown' && !isOpen && filteredWords.length > 0) {
      setIsOpen(true);
    }
  };

  /**
   * Limpia el campo de búsqueda
   */
  const handleClearSearch = () => {
    setSearchText('');
    setDebouncedSearchText('');
    setFilteredWords([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  /**
   * Limpia toda la selección de palabras
   */
  const handleClearAll = () => {
    onSelectionChange([]);
  };

  /**
   * Maneja la eliminación de una palabra seleccionada
   */
  const handleRemoveWord = (wordId: string) => {
    // Activar flag de protección
    setIsRemovingWord(true);
    
    // Cerrar dropdown inmediatamente
    setIsOpen(false);
    
    // Actualizar selección
    const newSelection = selectedWords.filter(w => w.id !== wordId);
    onSelectionChange(newSelection);
    
    // Resetear flag después de medio segundo
    setTimeout(() => {
      setIsRemovingWord(false);
    }, 500);
  };

  /**
   * Maneja el focus del campo de búsqueda
   */
  const handleFocus = () => {
    // Solo abrir si hay resultados y no estamos eliminando
    if (filteredWords.length > 0 && !isRemovingWord) {
      setIsOpen(true);
    }
  };

  /**
   * Maneja clicks fuera del componente
   */
  const handleClickAway = () => {
    setIsOpen(false);
  };

  // ============================================================================
  // RENDERIZADO DE INDICADORES DE ESTADO
  // ============================================================================
  
  const renderSearchIndicators = () => {
    // Texto muy corto
    if (searchText.length > 0 && searchText.length < 2) {
      return (
        <Typography variant="caption" color="text.secondary">
          Escribe al menos 2 caracteres para buscar
        </Typography>
      );
    }
    
    // Buscando (debouncing)
    if (searchText && searchText !== debouncedSearchText && searchText.length >= 2) {
      return (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Buscando...
        </Typography>
      );
    }
    
    // Sin resultados
    if (debouncedSearchText && debouncedSearchText.length >= 2 && filteredWords.length === 0) {
      return (
        <Typography variant="caption" color="text.secondary">
          No hay palabras disponibles para "{debouncedSearchText}"
        </Typography>
      );
    }
    
    return null;
  };

  // ============================================================================
  // RENDERIZADO PRINCIPAL
  // ============================================================================
  
  return (
    <Box>
      {/* SECCIÓN DE BÚSQUEDA */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box>
          {/* Campo de búsqueda */}
          <Box ref={textFieldRef}>
            <TextField
              fullWidth
              inputRef={inputRef}
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              disabled={disabled}
              placeholder="Busca palabras por su forma latina o traducción española..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                    borderRadius: isOpen ? '4px 4px 0 0' : '4px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                    borderRadius: isOpen ? '4px 4px 0 0' : '4px',
                  }
                }
              }}
            />
          </Box>
          
          {/* Indicadores de estado de búsqueda */}
          {renderSearchIndicators() && (
            <Box sx={{ mt: 1 }}>
              {renderSearchIndicators()}
            </Box>
          )}

          {/* Dropdown con resultados */}
          <Popper
            open={isOpen}
            anchorEl={textFieldRef.current}
            placement="bottom-start"
            style={{ 
              width: textFieldRef.current?.clientWidth || 'auto', 
              zIndex: 1300
            }}
            transition
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 0],
                },
              },
            ]}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper 
                  elevation={8}
                  sx={{ 
                    maxHeight: 450,
                    overflow: 'auto',
                    borderLeft: '2px solid',
                    borderRight: '2px solid',
                    borderBottom: '2px solid',
                    borderTop: 'none',
                    borderColor: 'primary.main',
                    borderRadius: '0 0 4px 4px',
                  }}
                >
                  {filteredWords.length > 0 ? (
                    <Box>
                      {/* Chips de palabras disponibles */}
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {filteredWords.map((word) => (
                            <Box
                              key={word.id}
                              sx={{
                                cursor: 'pointer',
                                display: 'inline-block',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  transition: 'transform 0.2s ease',
                                },
                              }}
                            >
                              <SelectedWordChip
                                word={word}
                                variant="default"
                                showTooltip={false}
                                colorByDeclension={true}
                                onClick={() => handleWordSelect(word)}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      
                      {/* Información de ayuda */}
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'background.default',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          Haz clic para seleccionar • ESC para cerrar
                        </Typography>
                        {selectedWords.length >= maxSelection && (
                          <Typography variant="caption" color="warning.main" display="block">
                            Máximo de {maxSelection} palabras alcanzado
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ) : debouncedSearchText.length >= 2 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron palabras con "{debouncedSearchText}"
                      </Typography>
                    </Box>
                  ) : null}
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      </ClickAwayListener>

      {/* SECCIÓN DE PALABRAS SELECCIONADAS */}
      <SelectedWordsDisplay
        selectedWords={selectedWords}
        onRemoveWord={handleRemoveWord}
        onClearAll={handleClearAll}
        onWordClick={(word) => {
          console.log('Palabra seleccionada clickeada:', word.nominative);
        }}
        showTooltips={true}
        colorByDeclension={true}
        data-testid="word-search-dropdown-selected-words"
      />
    </Box>
  );
};

export default WordSearchDropdown;