/**
 * WORD SEARCH DROPDOWN COMPONENT
 * 
 * Barra de búsqueda con dropdown que muestra palabras del vocabulario.
 * Permite buscar y seleccionar múltiples palabras sin cerrar el dropdown.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Autocomplete: Componente de MUI para búsqueda con sugerencias
 * - Popper: Elemento flotante que se posiciona relativo a otro
 * - Multi-select: Permite seleccionar múltiples opciones
 * - Debouncing: Retrasa la búsqueda hasta que el usuario deja de escribir
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  Popper,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  ClickAwayListener,  // Detecta clicks fuera del componente
  Fade,
  Stack,  // Para apilar elementos con espaciado automático
  Chip,
} from '@mui/material';

// Iconos
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Importar el WordCard para mostrar resultados
import WordCard from './WordCard';
import type { LatinWord } from './WordCard';

// Importar SelectedWordChip para mostrar palabras seleccionadas
import SelectedWordChip from './SelectedWordChip';

// Importar el servicio de vocabulario
// Usamos el nombre del paquete definido en package.json
import { VocabularyService } from '@latin-app/data';

/**
 * PROPS DEL COMPONENTE
 */
interface WordSearchDropdownProps {
  // Palabras actualmente seleccionadas
  selectedWords: LatinWord[];
  // Callback cuando cambia la selección
  onSelectionChange: (words: LatinWord[]) => void;
  // Máximo número de palabras que se pueden seleccionar
  maxSelection?: number;
  // Placeholder del campo de búsqueda
  placeholder?: string;
  // Deshabilitado
  disabled?: boolean;
}

/**
 * COMPONENTE WORD SEARCH DROPDOWN
 * 
 * Búsqueda interactiva con dropdown de resultados.
 * Usa el VocabularyService para buscar en el vocabulario real.
 */
const WordSearchDropdown: React.FC<WordSearchDropdownProps> = ({
  selectedWords,
  onSelectionChange,
  maxSelection = 20,
  placeholder = 'Buscar palabras en latín o español...',
  disabled = false
}) => {
  // ESTADOS
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredWords, setFilteredWords] = useState<LatinWord[]>([]);
  
  // Referencias DOM
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Instancia del servicio de vocabulario
  const vocabularyService = useMemo(() => new VocabularyService(), []);

  /**
   * DEBOUNCING
   * Retrasa la búsqueda 300ms después de que el usuario deja de escribir
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  /**
   * BÚSQUEDA DE PALABRAS
   * Se ejecuta cuando cambia el texto debounced o la selección
   */
  useEffect(() => {
    if (debouncedSearchText.trim().length < 2) {
      // No buscar con menos de 2 caracteres
      setFilteredWords([]);
      return;
    }

    // Buscar en el servicio de vocabulario
    const results = vocabularyService.searchWords(debouncedSearchText);
    
    // Filtrar las palabras ya seleccionadas
    // Crear un Set con los IDs seleccionados para búsqueda más eficiente
    const selectedIds = new Set(selectedWords.map(w => w.id));
    const filteredResults = results.filter(word => !selectedIds.has(word.id));
    
    // Limitar a 10 resultados para no saturar el dropdown
    setFilteredWords(filteredResults.slice(0, 10));
    
    // Abrir el dropdown si hay resultados
    if (filteredResults.length > 0) {
      setIsOpen(true);
    } else {
      // Cerrar si no hay resultados
      setIsOpen(false);
    }
  }, [debouncedSearchText, vocabularyService, selectedWords]);

  /**
   * MANEJADOR DE CAMBIO DE TEXTO
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    
    // Abrir dropdown cuando el usuario empieza a escribir
    if (value.length >= 2) {
      setIsOpen(true);
    }
  };

  /**
   * MANEJADOR DE SELECCIÓN DE PALABRA
   */
  const handleWordSelect = (word: LatinWord) => {
    // Solo agregar si no excede el máximo
    // No necesitamos verificar si ya está seleccionada porque
    // las palabras seleccionadas ya no aparecen en el dropdown
    if (selectedWords.length < maxSelection) {
      onSelectionChange([...selectedWords, word]);
    }
    
    // NO cerrar el dropdown para permitir selección múltiple
    // El dropdown se cierra con ESC o click afuera
  };

  /**
   * MANEJADOR DE TECLAS
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      // Cerrar dropdown con ESC
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (event.key === 'ArrowDown' && !isOpen && filteredWords.length > 0) {
      // Abrir con flecha abajo
      setIsOpen(true);
    }
  };

  /**
   * LIMPIAR BÚSQUEDA
   */
  const handleClear = () => {
    setSearchText('');
    setDebouncedSearchText('');
    setFilteredWords([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  /**
   * LIMPIAR SELECCIÓN
   */
  const handleClearSelection = () => {
    onSelectionChange([]);
  };


  return (
    <Box>
      {/* CAMPO DE BÚSQUEDA */}
      <ClickAwayListener onClickAway={() => setIsOpen(false)}>
        <Box ref={anchorRef}>
          <TextField
            fullWidth
            inputRef={inputRef}
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredWords.length > 0) {
                setIsOpen(true);
              }
            }}
            disabled={disabled}
            placeholder={placeholder}
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
                    onClick={handleClear}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  }
                }
              }
            }}
          />
          
          {/* INDICADORES DE BÚSQUEDA Y SELECCIÓN */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {searchText.length > 0 && searchText.length < 2 && (
                <span>Escribe al menos 2 caracteres para buscar</span>
              )}
              {searchText && searchText !== debouncedSearchText && searchText.length >= 2 && (
                <span style={{ fontStyle: 'italic' }}>Buscando...</span>
              )}
              {debouncedSearchText && debouncedSearchText.length >= 2 && filteredWords.length > 0 && (
                <span>{filteredWords.length} palabra{filteredWords.length !== 1 ? 's' : ''} disponible{filteredWords.length !== 1 ? 's' : ''}</span>
              )}
              {debouncedSearchText && debouncedSearchText.length >= 2 && filteredWords.length === 0 && (
                <span>No hay palabras disponibles para "{debouncedSearchText}"</span>
              )}
            </Typography>
            
            {selectedWords.length > 0 && (
              <Chip
                label={`${selectedWords.length} seleccionada${selectedWords.length !== 1 ? 's' : ''}`}
                size="small"
                onDelete={handleClearSelection}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          {/* DROPDOWN CON RESULTADOS */}
          <Popper
            open={isOpen}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            style={{ width: anchorRef.current?.clientWidth || 'auto', zIndex: 1300 }}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper 
                  elevation={8}
                  sx={{ 
                    mt: 1,
                    maxHeight: 400,
                    overflow: 'auto',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {/* LISTA DE RESULTADOS */}
                  {filteredWords.length > 0 ? (
                    <Box>
                      {/* Título del dropdown */}
                      <Box sx={{ p: 2, pb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Palabras disponibles:
                        </Typography>
                      </Box>
                      
                      {/* Lista de palabras usando SelectedWordChip */}
                      <Box sx={{ p: 2, pt: 1 }}>
                        <Stack spacing={1}>
                          {filteredWords.map((word) => (
                            <Box
                              key={word.id}
                              onClick={() => handleWordSelect(word)}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'translateX(4px)',
                                  transition: 'transform 0.2s ease',
                                },
                              }}
                            >
                              {/* SelectedWordChip sin botón de eliminar para el dropdown */}
                              <SelectedWordChip
                                word={word}
                                variant="default"
                                showTooltip={false}
                                colorByDeclension={true}
                                // Sin onDelete para que no aparezca la X
                              />
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                      
                      {/* INFORMACIÓN DE SELECCIÓN */}
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
                    // Sin resultados
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

      {/* PALABRAS SELECCIONADAS (usando SelectedWordChip con botón de eliminar) */}
      {selectedWords.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
            Palabras seleccionadas ({selectedWords.length}/{maxSelection}):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {selectedWords.map(word => (
              <SelectedWordChip
                key={word.id}
                word={word}
                onDelete={(wordId) => {
                  // Eliminar la palabra de la selección
                  const newSelection = selectedWords.filter(w => w.id !== wordId);
                  onSelectionChange(newSelection);
                }}
                variant="default"  // Variante con enunciación completa
                showTooltip={true}  // Mostrar tooltip con información
                colorByDeclension={true}  // Colores por declinación
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default WordSearchDropdown;