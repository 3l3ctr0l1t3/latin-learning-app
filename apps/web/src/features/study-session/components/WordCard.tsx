/**
 * WORD CARD COMPONENT
 * 
 * Este componente muestra una palabra latina con toda su información gramatical
 * en formato de tarjeta. Es un componente "presentacional" - solo muestra datos,
 * no maneja estado ni lógica compleja.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Card/Paper: En Material Design, las tarjetas son superficies que contienen contenido
 * - Elevation: La "elevación" simula profundidad con sombras
 * - Typography variants: MUI tiene variantes predefinidas para diferentes tipos de texto
 */

import React from 'react';
import {
  Card,           // Contenedor tipo tarjeta con elevación
  CardContent,   // Área de contenido dentro de la tarjeta
  Typography,    // Componente para texto con estilos
  Box,           // Contenedor flexible (como div con superpoderes)
  Chip,          // Pequeña etiqueta para mostrar información
  Stack,         // Layout vertical u horizontal con espaciado automático
  Divider,       // Línea divisoria
} from '@mui/material';

// Iconos para hacer la tarjeta más visual
import TranslateIcon from '@mui/icons-material/Translate'; // Para traducción

// Importar colores por declinación
import { getDeclensionColor } from '../constants/colors';

/**
 * INTERFAZ DE DATOS DE PALABRA
 * Esta interfaz define la estructura de una palabra latina
 * Coincide con la estructura de nuestro archivo vocabulary-normalized.json
 */
export interface LatinWord {
  id: string;                      // Identificador único (ej: "word_rosa_0001")
  nominative: string;              // Caso nominativo (sujeto)
  genitive: string;                // Caso genitivo (posesión)
  declension: string;              // Declinación (1st, 2nd, 3rd, 4th, 5th)
  gender: string;                  // Género (masculine, feminine, neuter)
  spanishTranslation: string;      // Traducción al español
  additionalMeanings?: string[];   // Significados adicionales (opcional)
  exampleSentence?: string | null; // Oración de ejemplo (opcional)
}

/**
 * PROPS DEL COMPONENTE
 * Define qué propiedades recibe este componente
 */
interface WordCardProps {
  word: LatinWord;           // Los datos de la palabra a mostrar
  showTranslation?: boolean; // Si mostrar o no la traducción (por defecto true)
  compact?: boolean;         // Modo compacto con menos detalles (por defecto false)
  minimal?: boolean;         // Modo minimalista sin etiquetas (por defecto false)
  exercise?: boolean;        // Modo ejercicio: compacto, sin traducción, centrado (por defecto false)
  onClick?: () => void;      // Callback opcional cuando se hace clic en la tarjeta
  selected?: boolean;        // Si la tarjeta está seleccionada
}

// Importar colores del tema centralizado
import { LATIN_COLORS } from '../../../config/theme';

/**
 * MAPEO DE COLORES POR GÉNERO
 * Usa los colores centralizados del tema
 */
const genderColors: Record<string, string> = LATIN_COLORS.genders;

/**
 * TRADUCCIONES AL ESPAÑOL
 * Para mostrar los términos gramaticales en español
 */
const genderLabels: Record<string, string> = {
  masculine: 'Masculino',
  feminine: 'Femenino',
  neuter: 'Neutro',
};

const declensionLabels: Record<string, string> = {
  '1st': '1ª Declinación',
  '2nd': '2ª Declinación',
  '3rd': '3ª Declinación',
  '4th': '4ª Declinación',
  '5th': '5ª Declinación',
};

/**
 * COMPONENTE WORDCARD
 * 
 * Muestra una palabra latina en formato de tarjeta con toda su información
 * gramatical de forma clara y visualmente atractiva.
 */
const WordCard: React.FC<WordCardProps> = ({
  word,
  showTranslation = true,  // Por defecto muestra la traducción
  compact = false,          // Por defecto no es compacto
  minimal = false,          // Por defecto no es minimalista
  exercise = false,         // Por defecto no es modo ejercicio
  onClick,                  // Opcional, puede ser undefined
  selected = false,         // Por defecto no está seleccionada
}) => {
  /**
   * RENDERIZADO MODO EJERCICIO
   * Versión compacta para ejercicios: muestra solo la palabra con su información
   * gramatical, sin traducción. Perfecta para preguntas de ejercicios.
   */
  if (exercise) {
    return (
      <Card
        elevation={2}
        sx={{
          // Tamaño FIJO para evitar cambios de tamaño entre palabras
          width: { xs: '100%', sm: 450, md: 500, lg: 550, xl: 600 },  // Ancho fijo en desktop
          minHeight: { xs: 120, sm: 140, md: 160, lg: 170, xl: 180 },  // Altura mínima consistente
          height: { xs: 120, sm: 140, md: 160, lg: 170, xl: 180 },  // Altura fija para consistencia
          margin: '0 auto',  // Centrado horizontal
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          border: '2px solid',
          borderColor: 'primary.main',  // Borde púrpura para consistencia
          bgcolor: 'background.paper',
          '&:hover': onClick ? {
            elevation: 4,
            transform: 'translateY(-2px)',
          } : {},
        }}
        data-testid="word-card-exercise"
      >
        <CardContent sx={{ 
          textAlign: 'center',  // Todo centrado
          py: 2,
          px: 3
        }} data-testid="word-card-exercise-content">
          {/* ENUNCIACIÓN - Grande y centrada, con color por declinación */}
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: getDeclensionColor(word.declension),
              mb: 2,
              letterSpacing: 1
            }}
            data-testid="text-word-enunciation-exercise"
          >
            {word.nominative}, {word.genitive}
          </Typography>
          
          {/* Información gramatical en una línea */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            alignItems="center"
            data-testid="grammar-info-stack-exercise"
          >
            {/* Declinación */}
            <Chip 
              label={declensionLabels[word.declension]}
              size="medium"
              variant="outlined"
              sx={{ 
                borderColor: getDeclensionColor(word.declension),
                color: getDeclensionColor(word.declension),
                borderWidth: 2,
                fontWeight: 'medium'
              }}
              data-testid="chip-declension-exercise"
            />
            
            {/* Género */}
            <Chip 
              label={genderLabels[word.gender]}
              size="medium"
              sx={{ 
                bgcolor: genderColors[word.gender],
                color: 'white',
                fontWeight: 'bold'
              }}
              data-testid="chip-gender-exercise"
            />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  /**
   * RENDERIZADO MINIMALISTA
   * Modo ultra-limpio sin etiquetas, solo información esencial
   * Perfecto para flashcards y práctica rápida
   */
  if (minimal) {
    return (
      <Card
        elevation={selected ? 6 : 2}
        onClick={onClick}
        sx={{
          // TAMAÑO ESTÁTICO para todas las tarjetas
          width: '100%',  // Toma todo el ancho disponible del contenedor
          maxWidth: { xs: '100%', sm: 500, md: 550 },  // Ancho máximo consistente
          minHeight: { xs: 250, sm: 280, md: 300 },  // Altura mínima consistente
          height: { xs: 250, sm: 280, md: 300 },  // Altura fija para mantener consistencia
          margin: '0 auto',  // Centrado horizontal
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          border: selected ? 2 : '1px solid',
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: (theme) => 
            selected ? 'action.selected' : 
            theme.palette.mode === 'dark' ? '#1a1a1a' : '#fafafa',
          '&:hover': onClick ? {
            elevation: 4,
            transform: 'translateY(-2px)',
          } : {},
        }}
        data-testid="word-card-minimal"
      >
        <CardContent sx={{ 
          textAlign: 'center',  // Texto centrado horizontalmente
          height: '100%',  // Usa toda la altura de la tarjeta
          display: 'flex',  // Contenedor flex
          flexDirection: 'column',  // Elementos apilados verticalmente
          justifyContent: 'center',  // Centra el contenido verticalmente
          py: 3  // Padding vertical
        }} data-testid="word-card-minimal-content">
          {/* ENUNCIACIÓN - Grande y centrada, con color por declinación */}
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: getDeclensionColor(word.declension),
              mb: 2,
              letterSpacing: 1
            }}
            data-testid="text-word-enunciation-minimal"
          >
            {word.nominative}, {word.genitive}
          </Typography>
          
          {/* Información gramatical en una línea simple, sin etiquetas */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            alignItems="center"
            sx={{ mb: 2 }}
            data-testid="grammar-info-stack-minimal"
          >
            {/* Declinación - Con color matching */}
            <Chip 
              label={declensionLabels[word.declension]}
              size="medium"
              variant="outlined"
              sx={{ 
                borderColor: getDeclensionColor(word.declension),
                color: getDeclensionColor(word.declension),
                borderWidth: 2
              }}
              data-testid="chip-declension-minimal"
            />
            
            {/* Género - Solo el chip con color */}
            <Chip 
              label={genderLabels[word.gender]}
              size="medium"
              sx={{ 
                bgcolor: genderColors[word.gender],
                color: 'white',
                fontWeight: 'bold'
              }}
              data-testid="chip-gender-minimal"
            />
          </Stack>
          
          {/* Traducción - Sin etiqueta, solo el texto */}
          {showTranslation && (
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 3,
                color: 'text.primary',
                fontWeight: 'medium'
              }}
              data-testid="text-translation-minimal"
            >
              {word.spanishTranslation}
            </Typography>
          )}
          
          {/* Significados adicionales - más sutiles */}
          {showTranslation && word.additionalMeanings && word.additionalMeanings.length > 0 && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1,
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
              data-testid="text-additional-meanings-minimal"
            >
              ({word.additionalMeanings.join(', ')})
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  /**
   * RENDERIZADO CONDICIONAL
   * En modo compacto mostramos menos información para ahorrar espacio
   */
  if (compact) {
    return (
      <Card
        // elevation controla la sombra (más alto = más sombra)
        elevation={selected ? 8 : 2}
        onClick={onClick}
        sx={{
          // TAMAÑO ESTÁTICO para mantener consistencia
          width: '100%',  // Toma todo el ancho disponible
          maxWidth: { xs: '100%', sm: 400, md: 450 },  // Ancho máximo más pequeño que minimal
          minHeight: { xs: 100, sm: 110, md: 120 },  // Altura más compacta
          height: { xs: 100, sm: 110, md: 120 },  // Altura fija compacta
          margin: '0 auto',  // Centrado horizontal
          // sx es el prop para estilos en MUI
          cursor: onClick ? 'pointer' : 'default', // Cursor de mano si es clickeable
          transition: 'all 0.3s ease', // Animación suave para cambios
          border: selected ? 2 : 0, // Borde si está seleccionada
          borderColor: 'primary.main',
          // Efecto hover - se activa cuando el mouse está encima
          '&:hover': onClick ? {
            elevation: 4,
            transform: 'translateY(-2px)', // Sube ligeramente la tarjeta
          } : {},
        }}
        data-testid="word-card-compact"
      >
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 2 },  // padding responsivo
          height: '100%',  // Usa toda la altura disponible
          display: 'flex',  // Contenedor flex
          alignItems: 'center'  // Centra verticalmente el contenido
        }} data-testid="word-card-compact-content">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} // Columna en móvil, fila en desktop
            spacing={{ xs: 1, sm: 2 }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            data-testid="compact-info-stack">
            {/* ENUNCIACIÓN COMPLETA - Con color por declinación */}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: getDeclensionColor(word.declension)
              }}
              data-testid="text-word-enunciation-compact"
            >
              {word.nominative}, {word.genitive}
            </Typography>
            
            {/* Chips con información básica */}
            <Chip 
              label={genderLabels[word.gender]} 
              size="small"
              sx={{ 
                bgcolor: genderColors[word.gender],
                color: 'white',
              }}
              data-testid="chip-gender-compact"
            />
            
            {/* Traducción si está habilitada */}
            {showTranslation && (
              <Typography variant="body2" color="text.secondary" data-testid="text-translation-compact">
                {word.spanishTranslation}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  /**
   * RENDERIZADO COMPLETO
   * Versión completa de la tarjeta con toda la información
   */
  return (
    <Card
      elevation={selected ? 8 : 3}
      onClick={onClick}
      sx={{
        // TAMAÑO ESTÁTICO para todas las presentaciones
        width: '100%',  // Toma todo el ancho disponible
        maxWidth: { xs: '100%', sm: 550, md: 600 },  // Ancho máximo más grande para versión completa
        minHeight: { xs: 320, sm: 350, md: 380 },  // Altura mayor para toda la información
        height: { xs: 320, sm: 350, md: 380 },  // Altura fija para consistencia
        margin: '0 auto',  // Centrado horizontal
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        border: selected ? 2 : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        // backgroundColor sutilmente diferente del fondo de página
        bgcolor: (theme) => 
          selected ? 'action.selected' : 
          theme.palette.mode === 'dark' ? '#1a1a1a' : '#fafafa',
        '&:hover': onClick ? {
          elevation: 6,
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[6], // Sombra del tema
        } : {},
      }}
      data-testid="word-card-full"
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }} data-testid="word-card-full-content">
        {/* ENUNCIACIÓN, DECLINACIÓN Y GÉNERO AGRUPADOS PARA MEJOR LECTURA */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 3
        }} data-testid="word-header-section">
          {/* LÍNEA SUPERIOR: ENUNCIACIÓN + CHIPS JUNTOS EN DESKTOP */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            gap: { xs: 2, md: 2 },
            flexWrap: { xs: 'wrap', md: 'nowrap' }
          }}>
            {/* ENUNCIACIÓN PRINCIPAL - Con color por declinación */}
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: getDeclensionColor(word.declension),
                letterSpacing: 1,
                textAlign: { xs: 'center', md: 'left' }
              }}
              data-testid="text-word-enunciation-full"
            >
              {word.nominative}, {word.genitive}
            </Typography>
            
            {/* DECLINACIÓN Y GÉNERO - Ahora al lado inmediato del texto en desktop */}
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
              data-testid="grammar-chips-stack"
            >
            {/* Declinación */}
            <Chip 
              label={declensionLabels[word.declension]}
              size="medium"
              variant="outlined"
              sx={{ 
                borderColor: getDeclensionColor(word.declension),
                borderWidth: 2,
                fontWeight: 'medium',
                color: getDeclensionColor(word.declension)
              }}
              data-testid="chip-declension-full"
            />
            
            {/* Género */}
            <Chip 
              label={genderLabels[word.gender]}
              size="medium"
              sx={{ 
                bgcolor: genderColors[word.gender],
                color: 'white',
                fontWeight: 'bold'
              }}
              data-testid="chip-gender-full"
            />
          </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} data-testid="word-card-divider-1" />

        {/* TRADUCCIÓN */}
        {showTranslation && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }} data-testid="translation-section">
            <TranslateIcon sx={{ mr: 1, color: 'info.main', fontSize: 20, mt: 0.5 }} data-testid="translation-icon" />
            <Box data-testid="translation-content">
              <Typography variant="subtitle2" color="text.secondary" data-testid="text-translation-label">
                Traducción:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }} data-testid="text-translation-full">
                {word.spanishTranslation}
              </Typography>
              
              {/* Significados adicionales si existen */}
              {word.additionalMeanings && word.additionalMeanings.length > 0 && (
                <Box sx={{ mt: 1 }} data-testid="additional-meanings-section">
                  <Typography variant="caption" color="text.secondary" data-testid="text-additional-meanings-label">
                    Otros significados:
                  </Typography>
                  <Typography variant="body2" data-testid="text-additional-meanings-full">
                    {word.additionalMeanings.join(', ')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ORACIÓN DE EJEMPLO (si existe) */}
        {word.exampleSentence && (
          <>
            <Divider sx={{ my: 2 }} data-testid="word-card-divider-2" />
            <Box sx={{ 
              p: 2, 
              bgcolor: 'action.hover', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }} data-testid="example-sentence-section">
              <Typography variant="caption" color="text.secondary" data-testid="text-example-label">
                Ejemplo:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }} data-testid="text-example-sentence">
                "{word.exampleSentence}"
              </Typography>
            </Box>
          </>
        )}

        {/* INDICADOR DE SELECCIÓN */}
        {selected && (
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '2px solid',
            borderColor: 'primary.main'
          }} data-testid="selected-indicator-section">
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
              data-testid="text-selected-indicator"
            >
              ✓ Seleccionada
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Exportar el componente
export default WordCard;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. CARD COMPONENTS:
 *    - Card: Contenedor con elevación y sombra
 *    - CardContent: Área de contenido con padding automático
 *    - Elevation: Simula profundidad con sombras (0-24)
 * 
 * 2. CONDITIONAL RENDERING:
 *    - Modo compacto vs completo según props
 *    - Mostrar/ocultar elementos con && operator
 *    - Diferentes estilos según estado (selected)
 * 
 * 3. MATERIAL DESIGN CHIPS:
 *    - Pequeñas etiquetas para información categorizada
 *    - Pueden tener colores, iconos, y ser clickeables
 *    - Útiles para tags, categorías, filtros
 * 
 * 4. STACK LAYOUT:
 *    - Organiza elementos vertical u horizontalmente
 *    - Espaciado automático entre elementos
 *    - Más simple que Box con flexbox manual
 * 
 * 5. SX PROP PATTERNS:
 *    - Hover effects con '&:hover'
 *    - Transiciones CSS para animaciones suaves
 *    - Acceso al tema con funciones (theme) => ...
 * 
 * 6. OPTIONAL PROPS:
 *    - Usar ? para props opcionales
 *    - Valores por defecto con = en parámetros
 *    - Renderizado condicional basado en props
 */