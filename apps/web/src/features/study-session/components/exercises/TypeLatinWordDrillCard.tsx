/**
 * TYPE LATIN WORD DRILL CARD COMPONENT
 * 
 * Ejercicio donde el usuario debe escribir la palabra latina completa.
 * Se muestra la traducción en español y el usuario debe escribir:
 * - Nominativo
 * - Genitivo
 * - Seleccionar género
 * - Seleccionar declinación
 * 
 * CONCEPTOS IMPORTANTES:
 * - Controlled Components: Los inputs están controlados por React state
 * - Tab Navigation: Orden lógico de tabulación para completar rápidamente
 * - Form Validation: Validación en tiempo real de las respuestas
 * - Composition Pattern: Usa BaseDrillCard para comportamiento común
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Fade,
  Alert,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import BaseDrillCard from './BaseDrillCard';
import type { LatinWord } from '../WordCard';
// Usar las funciones de comparación centralizadas que manejan macrones (ō→o)
import { compareStrings } from '@latin-app/shared';
// Usar los colores centralizados de la aplicación
import { getDeclensionColor } from '../../constants/colors';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * PROPS DEL COMPONENTE
 */
interface TypeLatinWordDrillCardProps {
  currentWord: LatinWord;                    // Palabra actual del ejercicio
  onAnswer: (isCorrect: boolean) => void;    // Callback cuando el usuario responde
  showLabels?: boolean;                      // Mostrar etiquetas de ayuda
  compact?: boolean;                         // Versión compacta para pantallas pequeñas
  hideHeader?: boolean;                      // Ocultar encabezado para ahorrar espacio
}

/**
 * COMPONENTE INTERNO DE EJERCICIO
 * Separamos la lógica del ejercicio para pasarla a BaseDrillCard
 */
const TypeLatinWordExercise: React.FC<{
  currentWord: LatinWord;
  onAnswer: (isCorrect: boolean) => void;
  showLabels: boolean;
  hasAnswered: boolean;
  isCorrect: boolean;
  onSubmit: (nominative: string, genitive: string, gender: string, declension: string) => void;
}> = ({ currentWord, showLabels, hasAnswered, onSubmit }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // Estados del formulario
  const [nominative, setNominative] = useState('');
  const [genitive, setGenitive] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedDeclension, setSelectedDeclension] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  
  // Referencias para focus management
  const nominativeRef = useRef<HTMLInputElement>(null);
  
  /**
   * RESETEAR FORMULARIO cuando cambia la palabra
   */
  useEffect(() => {
    setNominative('');
    setGenitive('');
    setSelectedGender('');
    setSelectedDeclension('');
    setShowHint(false);
    
    // Auto-focus en el primer campo
    if (nominativeRef.current) {
      nominativeRef.current.focus();
    }
  }, [currentWord.id]);
  
  /**
   * MANEJAR ENVÍO
   */
  const handleSubmit = () => {
    if (!nominative || !genitive || !selectedGender || !selectedDeclension) {
      return;
    }
    onSubmit(nominative, genitive, selectedGender, selectedDeclension);
  };
  
  const isFormComplete = nominative && genitive && selectedGender && selectedDeclension;
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormComplete && !hasAnswered) {
      handleSubmit();
    }
  };
  
  return (
    // Usar Box con flex en lugar de Stack para mejor control del layout
    // display: 'flex' con flexDirection: 'column' para layout vertical
    // gap proporciona espaciado entre elementos hijos
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1.5, sm: 2, md: 2.5 },
      height: '100%',  // Ocupar toda la altura disponible
      overflow: 'hidden'  // Prevenir scroll
    }}>
      {/* PREGUNTA - Palabra en español */}
      <Box sx={{ 
        flexShrink: 0,  // No permitir que se encoja
        textAlign: 'center' 
      }}>
        <Typography 
          variant={isMdUp ? 'h4' : 'h5'}
          sx={{ 
            color: 'text.primary',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {currentWord.spanishTranslation}
        </Typography>
        {currentWord.additionalMeanings && currentWord.additionalMeanings.length > 0 && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            También: {currentWord.additionalMeanings.join(', ')}
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      {/* CAMPOS DE TEXTO - Usando flexbox */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
        flexShrink: 0  // No permitir que se encoja
      }}>
        {/* Campo Nominativo */}
        <TextField
          inputRef={nominativeRef}
          label="Nominativo"
          value={nominative}
          onChange={(e) => setNominative(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={hasAnswered}
          fullWidth
          variant="outlined"
          placeholder="Ej: Rosa"
          error={hasAnswered && !compareStrings(nominative, currentWord.nominative)}
          helperText={
            hasAnswered && !compareStrings(nominative, currentWord.nominative) 
              ? `Correcto: ${currentWord.nominative}`
              : showLabels ? 'Caso nominativo (sujeto)' : ''
          }
          InputProps={{
            endAdornment: hasAnswered && (
              compareStrings(nominative, currentWord.nominative) 
                ? <CheckIcon color="success" />
                : <CloseIcon color="error" />
            )
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: { xs: '1rem', md: '1.1rem' }
            }
          }}
          inputProps={{
            tabIndex: 1,
            'data-testid': 'input-nominative'
          }}
        />
        
        {/* Campo Genitivo */}
        <TextField
          label="Genitivo"
          value={genitive}
          onChange={(e) => setGenitive(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={hasAnswered}
          fullWidth
          variant="outlined"
          placeholder="Ej: Rosae"
          error={hasAnswered && !compareStrings(genitive, currentWord.genitive)}
          helperText={
            hasAnswered && !compareStrings(genitive, currentWord.genitive)
              ? `Correcto: ${currentWord.genitive}`
              : showLabels ? 'Caso genitivo (de...)' : ''
          }
          InputProps={{
            endAdornment: hasAnswered && (
              compareStrings(genitive, currentWord.genitive)
                ? <CheckIcon color="success" />
                : <CloseIcon color="error" />
            )
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: { xs: '1rem', md: '1.1rem' }
            }
          }}
          inputProps={{
            tabIndex: 2,
            'data-testid': 'input-genitive'
          }}
        />
      </Box>
      
      {/* SELECCIÓN DE GÉNERO Y DECLINACIÓN - Usando flexbox */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 3 },
        width: '100%',
        flexShrink: 0  // No permitir que se encoja
      }}>
        {/* Selección de Género */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Género:
          </Typography>
          <ToggleButtonGroup
            value={selectedGender}
            exclusive
            onChange={(_, value) => value && setSelectedGender(value)}
            aria-label="género"
            fullWidth
            size={isMdUp ? "medium" : "small"}
            disabled={hasAnswered}
            sx={{
              '& .MuiToggleButton-root': {
                flex: 1,
                '&:nth-of-type(1)': { tabIndex: 3 },
                '&:nth-of-type(2)': { tabIndex: 4 },
                '&:nth-of-type(3)': { tabIndex: 5 },
              }
            }}
          >
            <ToggleButton 
              value="masculine" 
              data-testid="button-gender-masculine"
              sx={{
                color: hasAnswered && selectedGender === 'masculine' 
                  ? (currentWord.gender === 'masculine' ? 'success.main' : 'error.main')
                  : undefined
              }}
            >
              Masculino
            </ToggleButton>
            <ToggleButton 
              value="feminine"
              data-testid="button-gender-feminine"
              sx={{
                color: hasAnswered && selectedGender === 'feminine'
                  ? (currentWord.gender === 'feminine' ? 'success.main' : 'error.main')
                  : undefined
              }}
            >
              Femenino
            </ToggleButton>
            <ToggleButton 
              value="neuter"
              data-testid="button-gender-neuter"
              sx={{
                color: hasAnswered && selectedGender === 'neuter'
                  ? (currentWord.gender === 'neuter' ? 'success.main' : 'error.main')
                  : undefined
              }}
            >
              Neutro
            </ToggleButton>
          </ToggleButtonGroup>
          {hasAnswered && selectedGender !== currentWord.gender && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              Correcto: {currentWord.gender === 'masculine' ? 'Masculino' : 
                        currentWord.gender === 'feminine' ? 'Femenino' : 'Neutro'}
            </Typography>
          )}
        </Box>
        
        {/* Selección de Declinación */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Declinación:
          </Typography>
          <ToggleButtonGroup
            value={selectedDeclension}
            exclusive
            onChange={(_, value) => value && setSelectedDeclension(value)}
            aria-label="declinación"
            fullWidth
            size={isMdUp ? "medium" : "small"}
            disabled={hasAnswered}
            sx={{
              '& .MuiToggleButton-root': {
                flex: 1,
                minWidth: 0,
                px: { xs: 1, md: 2 },
                '&:nth-of-type(1)': { tabIndex: 6 },
                '&:nth-of-type(2)': { tabIndex: 7 },
                '&:nth-of-type(3)': { tabIndex: 8 },
                '&:nth-of-type(4)': { tabIndex: 9 },
                '&:nth-of-type(5)': { tabIndex: 10 },
              }
            }}
          >
            {['1st', '2nd', '3rd', '4th', '5th'].map((decl) => (
              <ToggleButton 
                key={decl}
                value={decl}
                data-testid={`button-declension-${decl}`}
                sx={{
                  // Usar colores centralizados
                  borderColor: getDeclensionColor(decl),
                  '&.Mui-selected': {
                    bgcolor: `${getDeclensionColor(decl)}20`,
                    borderColor: getDeclensionColor(decl),
                    color: getDeclensionColor(decl),
                  },
                  color: hasAnswered && selectedDeclension === decl
                    ? (currentWord.declension === decl ? 'success.main' : 'error.main')
                    : undefined
                }}
              >
                {decl.charAt(0)}ª
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {hasAnswered && selectedDeclension !== currentWord.declension && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              Correcto: {currentWord.declension}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* BOTÓN DE AYUDA */}
      {!hasAnswered && showLabels && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          flexShrink: 0  // No permitir que se encoja
        }}>
          <Button
            size="small"
            startIcon={<HelpOutlineIcon />}
            onClick={() => setShowHint(!showHint)}
            sx={{ textTransform: 'none' }}
          >
            {showHint ? 'Ocultar pista' : 'Mostrar pista'}
          </Button>
        </Box>
      )}
      
      {/* PISTA */}
      {showHint && !hasAnswered && (
        <Fade in>
          <Alert severity="info" sx={{ py: 1 }}>
            <Typography variant="body2">
              Primera letra del nominativo: <strong>{currentWord.nominative.charAt(0)}</strong>
              {' • '}
              Terminación del genitivo: <strong>-{currentWord.genitive.slice(-2)}</strong>
            </Typography>
          </Alert>
        </Fade>
      )}
      
      {/* BOTÓN DE ENVIAR */}
      {!hasAnswered && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexShrink: 0,  // No permitir que se encoja
          mt: 'auto'  // Empujar hacia abajo usando margin-top auto
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!isFormComplete}
            tabIndex={11}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
            data-testid="button-submit-answer"
          >
            Verificar Respuesta
          </Button>
        </Box>
      )}
    </Box>
  );
};

/**
 * TYPE LATIN WORD DRILL CARD COMPONENT
 * 
 * Componente principal que usa BaseDrillCard para el contenedor
 * y maneja el estado general del ejercicio
 */
const TypeLatinWordDrillCard: React.FC<TypeLatinWordDrillCardProps> = ({
  currentWord,
  onAnswer,
  showLabels = true,
  compact = false,
  hideHeader = false
}) => {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  /**
   * RESETEAR ESTADO cuando cambia la palabra
   */
  useEffect(() => {
    setHasAnswered(false);
    setIsCorrect(false);
  }, [currentWord.id]);
  
  /**
   * MANEJAR RESPUESTA
   */
  const handleSubmit = (nominative: string, genitive: string, gender: string, declension: string) => {
    // Comparar todas las respuestas usando compareStrings que maneja macrones
    const nominativeCorrect = compareStrings(nominative, currentWord.nominative);
    const genitiveCorrect = compareStrings(genitive, currentWord.genitive);
    const genderCorrect = gender === currentWord.gender;
    const declensionCorrect = declension === currentWord.declension;
    
    const allCorrect = nominativeCorrect && genitiveCorrect && genderCorrect && declensionCorrect;
    
    setIsCorrect(allCorrect);
    setHasAnswered(true);
    onAnswer(allCorrect);
  };
  
  /**
   * USAR BaseDrillCard CON COMPOSICIÓN
   * Le pasamos nuestro contenido específico y él maneja:
   * - El borde de feedback (verde/rojo con glow)
   * - El layout general
   * - La estructura común
   */
  return (
    <BaseDrillCard
      title="Escribir en Latín"
      subtitle="Traduce la palabra al latín con todos sus atributos"
      isAnswered={hasAnswered}
      isCorrect={isCorrect}
      compact={compact}
      hideHeader={hideHeader}
      maxWidth={{ xs: '100%', md: 600, lg: 700 }}
      
      // Contenido específico del ejercicio
      exerciseContent={
        <TypeLatinWordExercise
          currentWord={currentWord}
          onAnswer={onAnswer}
          showLabels={showLabels}
          hasAnswered={hasAnswered}
          isCorrect={isCorrect}
          onSubmit={handleSubmit}
        />
      }
      
      // Feedback adicional después de responder
      feedbackContent={
        hasAnswered && (
          <Alert 
            severity={isCorrect ? 'success' : 'error'}
            sx={{ textAlign: 'left' }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {isCorrect ? '¡Excelente! Respuesta correcta.' : 'Respuesta incorrecta.'}
            </Typography>
            {!isCorrect && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Respuesta correcta: <strong>{currentWord.nominative}, {currentWord.genitive}</strong>
                  {' • '}
                  {currentWord.gender === 'masculine' ? 'Masculino' : 
                   currentWord.gender === 'feminine' ? 'Femenino' : 'Neutro'}
                  {' • '}
                  {currentWord.declension}
                </Typography>
              </Box>
            )}
          </Alert>
        )
      }
    />
  );
};

export default TypeLatinWordDrillCard;