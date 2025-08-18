/**
 * FONT SIZE SELECTOR COMPONENT - Selector de tamaño de fuente para la aplicación
 * 
 * Este componente permite al usuario cambiar el tamaño de fuente de toda la aplicación.
 * Usa un ToggleButtonGroup de MUI para mostrar las opciones disponibles.
 * 
 * CARACTERÍSTICAS:
 * - 4 opciones de tamaño: Pequeño, Mediano, Grande, Extra Grande
 * - Muestra una vista previa del tamaño de cada opción
 * - Guarda automáticamente la selección en localStorage
 * - Se sincroniza con el contexto global de la aplicación
 * - Totalmente responsive para móvil y desktop
 */

import React from 'react';

// Importar componentes de MUI necesarios
// Box: contenedor flexible para layout
// Typography: componente para texto con estilos predefinidos
// ToggleButton: botón que puede estar seleccionado o no
// ToggleButtonGroup: grupo de ToggleButtons donde solo uno puede estar activo
import { 
  Box, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup,
  Paper,
  Divider 
} from '@mui/material';

// Importar iconos de MUI para representar visualmente los tamaños
// Estos iconos ayudan a los usuarios a entender rápidamente cada opción
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

// Importar el hook y tipos del contexto de configuraciones
// Usamos "import type" para tipos que solo se usan en TypeScript
import type { FontSizeOption } from '../../contexts/AppSettingsContext';
import { 
  useAppSettings, 
  FONT_SIZE_LABELS,
  FONT_SIZE_SCALES 
} from '../../contexts/AppSettingsContext';

/**
 * COMPONENTE FontSizeSelector
 * 
 * No recibe props porque obtiene todo lo que necesita del contexto global.
 * Esto es un ejemplo del patrón "Smart Component" o "Container Component"
 * que se conecta directamente al estado global.
 */
export const FontSizeSelector: React.FC = () => {
  // Obtener el tamaño actual y la función para cambiarlo del contexto
  // useAppSettings() es nuestro custom hook que simplifica el acceso al contexto
  const { fontSize, setFontSize } = useAppSettings();
  
  /**
   * MANEJADOR DE CAMBIO DE TAMAÑO
   * 
   * Esta función se ejecuta cuando el usuario selecciona un nuevo tamaño.
   * 
   * @param _event - El evento del mouse (no lo usamos, por eso el _)
   *                 El _ al inicio es una convención para indicar que
   *                 el parámetro no se usa pero es requerido por la API
   * @param newSize - El nuevo tamaño seleccionado, puede ser null si se deselecciona
   */
  const handleFontSizeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSize: FontSizeOption | null
  ) => {
    // Solo actualizar si hay un valor válido
    // newSize podría ser null si el usuario intenta deseleccionar todo
    // (aunque con exclusive={true} esto no debería pasar)
    if (newSize) {
      setFontSize(newSize);
      
      // Log para debugging - útil durante desarrollo
      console.log(`Tamaño de fuente cambiado a: ${FONT_SIZE_LABELS[newSize]}`);
    }
  };
  
  /**
   * ARRAY DE OPCIONES
   * 
   * Creamos un array con todas las opciones disponibles para poder
   * iterar sobre ellas con map(). Esto hace el código más mantenible
   * porque si agregamos más opciones, solo necesitamos actualizar los tipos.
   */
  const fontSizeOptions: FontSizeOption[] = ['small', 'medium', 'large', 'extraLarge'];
  
  return (
    // Contenedor principal con Paper para darle elevación visual
    // Paper es un componente de MUI que simula una hoja de papel con sombra
    <Paper
      data-testid="font-size-selector"
      elevation={0} // Sin sombra, usamos bordes en su lugar
      sx={{
        // Padding interno: 2 × 8px = 16px
        p: 2,
        // Borde sutil para definir los límites del componente
        border: '1px solid',
        borderColor: 'divider',
        // Bordes redondeados para consistencia con el diseño
        borderRadius: 2,
        // Color de fondo del tema
        bgcolor: 'background.paper',
      }}
    >
      {/* Título del selector - explica qué hace este control */}
      <Typography 
        variant="subtitle2" 
        gutterBottom // Agrega margen inferior automáticamente
        sx={{
          // Color de texto secundario para menor énfasis
          color: 'text.secondary',
          // Hacer el texto un poco más pequeño en móvil
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          // Peso de fuente medio para mejor legibilidad
          fontWeight: 500,
        }}
      >
        Tamaño de Texto
      </Typography>
      
      {/* GRUPO DE BOTONES DE SELECCIÓN */}
      <ToggleButtonGroup
        data-testid="font-size-toggle-group"
        value={fontSize} // El valor actualmente seleccionado
        exclusive // Solo permite una selección a la vez
        onChange={handleFontSizeChange} // Función a llamar cuando cambia
        aria-label="Selector de tamaño de fuente" // Accesibilidad para lectores de pantalla
        sx={{
          // Usar todo el ancho disponible
          width: '100%',
          // En móvil, apilar verticalmente los botones
          // En desktop, mostrarlos horizontalmente
          flexDirection: { xs: 'column', sm: 'row' },
          // Espacio entre botones
          gap: 1,
        }}
      >
        {/* Iterar sobre cada opción de tamaño */}
        {fontSizeOptions.map((size) => (
          <ToggleButton
            key={size} // React necesita una key única para cada elemento en un map
            value={size} // El valor que se pasa a onChange cuando se selecciona
            data-testid={`font-size-option-${size}`}
            sx={{
              // Flex: 1 hace que todos los botones tengan el mismo ancho
              flex: 1,
              // Padding adaptativo: más pequeño en móvil
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2 },
              // Bordes redondeados
              borderRadius: 1,
              // Transición suave para hover y selección
              transition: 'all 0.2s ease',
              
              // Estilos cuando está seleccionado
              '&.Mui-selected': {
                // Color de fondo primario cuando está activo
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                // Efecto de elevación cuando está seleccionado
                boxShadow: '0 2px 8px rgba(187, 134, 252, 0.3)',
                
                // Mantener el color al hacer hover cuando está seleccionado
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
              
              // Estilos de hover cuando no está seleccionado
              '&:hover': {
                bgcolor: 'action.hover',
                // Transformación sutil para feedback visual
                transform: 'translateY(-1px)',
              },
            }}
          >
            {/* Contenedor para el contenido del botón */}
            <Box
              sx={{
                // Layout flex para organizar icono y texto
                display: 'flex',
                flexDirection: 'column', // Apilar verticalmente
                alignItems: 'center', // Centrar horizontalmente
                gap: 0.5, // Espacio entre elementos
              }}
            >
              {/* Icono representativo del tamaño */}
              {/* Renderizamos el icono directamente basado en el tamaño */}
              {/* Cada icono tiene su propio sx prop para estilos */}
              {size === 'small' && (
                <TextDecreaseIcon 
                  sx={{ 
                    fontSize: `${1.2 * FONT_SIZE_SCALES[size]}rem`,
                    minHeight: 24,
                  }} 
                />
              )}
              {size === 'medium' && (
                <TextFieldsIcon 
                  sx={{ 
                    fontSize: `${1.2 * FONT_SIZE_SCALES[size]}rem`,
                    minHeight: 24,
                  }} 
                />
              )}
              {size === 'large' && (
                <TextIncreaseIcon 
                  sx={{ 
                    fontSize: `${1.2 * FONT_SIZE_SCALES[size]}rem`,
                    minHeight: 24,
                  }} 
                />
              )}
              {size === 'extraLarge' && (
                <FormatSizeIcon 
                  sx={{ 
                    fontSize: `${1.2 * FONT_SIZE_SCALES[size]}rem`,
                    minHeight: 24,
                  }} 
                />
              )}
              
              {/* Etiqueta en español */}
              <Typography
                variant="caption"
                sx={{
                  // Tamaño de fuente adaptativo
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  // Peso medio para mejor legibilidad
                  fontWeight: 500,
                }}
              >
                {FONT_SIZE_LABELS[size]}
              </Typography>
              
              {/* Vista previa del tamaño - muestra "Aa" escalado */}
              <Typography
                variant="body2"
                sx={{
                  // Aplicar el escalado correspondiente a este tamaño
                  fontSize: `${FONT_SIZE_SCALES[size]}rem`,
                  // Color más tenue para no distraer
                  color: 'text.secondary',
                  // Asegurar que no se rompa en varias líneas
                  whiteSpace: 'nowrap',
                  // Altura de línea ajustada para mejor presentación
                  lineHeight: 1,
                }}
              >
                Aa
              </Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      
      {/* Divider visual para separar secciones */}
      <Divider sx={{ my: 1.5 }} />
      
      {/* Texto de ejemplo para ver el efecto inmediatamente */}
      <Box
        sx={{
          // Padding superior
          pt: 1,
          // Centro el contenido
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block', // Para que respete el textAlign
            mb: 0.5,
          }}
        >
          Vista previa:
        </Typography>
        
        {/* Texto de ejemplo que muestra el tamaño actual */}
        <Typography
          variant="body1"
          sx={{
            // Color primario para destacar
            color: 'primary.main',
            // Fuente un poco más gruesa
            fontWeight: 500,
          }}
        >
          Este texto usa el tamaño {FONT_SIZE_LABELS[fontSize].toLowerCase()}
        </Typography>
      </Box>
    </Paper>
  );
};

/**
 * EXPORTACIÓN POR DEFECTO
 * 
 * Exportamos el componente como default para permitir importación flexible:
 * import FontSizeSelector from './FontSizeSelector';
 * 
 * También está disponible como named export arriba:
 * import { FontSizeSelector } from './FontSizeSelector';
 */
export default FontSizeSelector;