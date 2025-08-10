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
import SchoolIcon from '@mui/icons-material/School'; // Para el título
import TranslateIcon from '@mui/icons-material/Translate'; // Para traducción
import CategoryIcon from '@mui/icons-material/Category'; // Para declinación

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
  onClick?: () => void;      // Callback opcional cuando se hace clic en la tarjeta
  selected?: boolean;        // Si la tarjeta está seleccionada
}

/**
 * MAPEO DE COLORES POR GÉNERO
 * Cada género tiene un color asociado para identificación visual rápida
 */
const genderColors: Record<string, string> = {
  masculine: '#2196F3',  // Azul para masculino
  feminine: '#E91E63',   // Rosa para femenino
  neuter: '#9C27B0',     // Púrpura para neutro
};

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
  onClick,                  // Opcional, puede ser undefined
  selected = false,         // Por defecto no está seleccionada
}) => {
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
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          border: selected ? 2 : 0,
          borderColor: 'primary.main',
          bgcolor: selected ? 'action.selected' : 'background.paper',
          '&:hover': onClick ? {
            elevation: 4,
            transform: 'translateY(-2px)',
          } : {},
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          {/* ENUNCIACIÓN - Grande y centrada, sin etiqueta */}
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
              letterSpacing: 1
            }}
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
          >
            {/* Declinación - Solo el valor */}
            <Chip 
              label={declensionLabels[word.declension]}
              size="medium"
              variant="outlined"
              sx={{ borderColor: 'secondary.main' }}
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
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}> {/* padding responsivo */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} // Columna en móvil, fila en desktop
            spacing={{ xs: 1, sm: 2 }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}>
            {/* ENUNCIACIÓN COMPLETA - Lo más importante incluso en modo compacto */}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main' 
              }}
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
            />
            
            {/* Traducción si está habilitada */}
            {showTranslation && (
              <Typography variant="body2" color="text.secondary">
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
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        border: selected ? 2 : 0,
        borderColor: 'primary.main',
        // backgroundColor cambia si está seleccionada
        bgcolor: selected ? 'action.selected' : 'background.paper',
        '&:hover': onClick ? {
          elevation: 6,
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[6], // Sombra del tema
        } : {},
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* ENUNCIACIÓN LATINA - LO MÁS IMPORTANTE */}
        {/* En latín, las palabras se enuncian con nominativo y genitivo */}
        {/* Esto es fundamental para identificar la declinación */}
        <Box sx={{ 
          textAlign: 'center', // Centrar el texto para darle importancia
          mb: { xs: 2, sm: 3 }, // Margen inferior responsivo
          p: { xs: 1.5, sm: 2 }, // Padding responsivo
          bgcolor: 'action.hover', // Fondo ligeramente diferente
          borderRadius: 2, // Bordes redondeados
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {/* Icono y etiqueta pequeña */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
            <SchoolIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="caption" color="text.secondary">
              ENUNCIACIÓN LATINA
            </Typography>
          </Box>
          
          {/* LA ENUNCIACIÓN PRINCIPAL - Nominativo, Genitivo */}
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              letterSpacing: 1, // Espaciado entre letras para mejor legibilidad
            }}
          >
            {word.nominative}, {word.genitive}
          </Typography>
        </Box>

        {/* INFORMACIÓN GRAMATICAL EN UNA LÍNEA */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Columna en móvil
          justifyContent: 'space-around', // Distribuir uniformemente
          alignItems: 'center',
          gap: { xs: 1, sm: 0 }, // Espacio entre elementos en móvil
          mb: 2,
          p: { xs: 1, sm: 1.5 },
          bgcolor: 'background.default',
          borderRadius: 1
        }}>
          {/* Declinación */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Declinación
            </Typography>
            <Chip 
              label={declensionLabels[word.declension]}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'secondary.main', mt: 0.5 }}
            />
          </Box>
          
          {/* Separador vertical */}
          <Divider orientation="vertical" flexItem />
          
          {/* Género */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Género
            </Typography>
            <Chip 
              label={genderLabels[word.gender]}
              size="small"
              sx={{ 
                bgcolor: genderColors[word.gender],
                color: 'white',
                fontWeight: 'bold',
                mt: 0.5
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} data-testid="word-card-divider-1" />

        {/* TRADUCCIÓN */}
        {showTranslation && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <TranslateIcon sx={{ mr: 1, color: 'info.main', fontSize: 20, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Traducción:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {word.spanishTranslation}
              </Typography>
              
              {/* Significados adicionales si existen */}
              {word.additionalMeanings && word.additionalMeanings.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Otros significados:
                  </Typography>
                  <Typography variant="body2">
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
            }}>
              <Typography variant="caption" color="text.secondary">
                Ejemplo:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
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
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
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