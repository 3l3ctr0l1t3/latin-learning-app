/**
 * DECLENSION FILTER COMPONENT
 * 
 * Componente para filtrar palabras latinas por declinación (1ª, 2ª, 3ª, 4ª, 5ª).
 * Usa "chips" (fichas) que el usuario puede seleccionar/deseleccionar.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Chip: Componente compacto e interactivo para selección, filtrado o entrada
 * - Toggle Selection: Permite múltiple selección, como checkboxes pero más visual
 * - Set: Estructura de datos de JavaScript para valores únicos
 */

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Tooltip,  // Muestra texto de ayuda al pasar el mouse
} from '@mui/material';

// Iconos para hacer más visual
import FilterListIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';

/**
 * TIPO: Declension
 * Las cinco declinaciones del latín
 */
export type Declension = '1st' | '2nd' | '3rd' | '4th' | '5th';

/**
 * CONFIGURACIÓN DE DECLINACIONES
 * Información sobre cada declinación para ayudar al estudiante
 */
const declensionInfo: Record<Declension, {
  label: string;
  example: string;
  color: string;
  description: string;
}> = {
  '1st': {
    label: '1ª',
    example: 'rosa, rosae',
    color: '#9C27B0', // Púrpura
    description: 'Mayoría femeninas, genitivo -ae'
  },
  '2nd': {
    label: '2ª',
    example: 'dominus, domini',
    color: '#2196F3', // Azul
    description: 'Masculinas/neutras, genitivo -i'
  },
  '3rd': {
    label: '3ª',
    example: 'rex, regis',
    color: '#4CAF50', // Verde
    description: 'Variada, genitivo -is'
  },
  '4th': {
    label: '4ª',
    example: 'manus, manus',
    color: '#FF9800', // Naranja
    description: 'Genitivo -us'
  },
  '5th': {
    label: '5ª',
    example: 'dies, diei',
    color: '#F44336', // Rojo
    description: 'Genitivo -ei'
  }
};

/**
 * PROPS DEL COMPONENTE
 */
interface DeclensionFilterProps {
  // selectedDeclensions es un array de strings
  selectedDeclensions: Declension[];
  // onChange recibe el nuevo array de declinaciones seleccionadas
  onChange: (declensions: Declension[]) => void;
  // Mostrar información adicional de ayuda
  showHelp?: boolean;
  // Desactivar el componente
  disabled?: boolean;
  // Orientación de los chips
  orientation?: 'horizontal' | 'vertical';
}

/**
 * COMPONENTE DECLENSION FILTER
 * 
 * Permite al usuario filtrar palabras por declinación usando chips interactivos.
 * Cada chip muestra el número de declinación y puede incluir información de ayuda.
 */
const DeclensionFilter: React.FC<DeclensionFilterProps> = ({
  selectedDeclensions,
  onChange,
  showHelp = true,
  disabled = false,
  orientation = 'horizontal'
}) => {
  /**
   * MANEJADOR DE CLICK EN CHIP
   * 
   * Cuando el usuario hace clic en un chip:
   * 1. Si está seleccionado, lo quita
   * 2. Si no está seleccionado, lo añade
   * 
   * Usamos un Set para operaciones más eficientes con arrays únicos
   */
  const handleChipClick = (declension: Declension) => {
    // Set es una estructura de datos que solo permite valores únicos
    // Es más eficiente que un array para verificar si contiene un elemento
    const currentSet = new Set(selectedDeclensions);
    
    if (currentSet.has(declension)) {
      // Si ya está, lo quitamos
      currentSet.delete(declension);
    } else {
      // Si no está, lo añadimos
      currentSet.add(declension);
    }
    
    // Convertimos el Set de vuelta a array y llamamos onChange
    // Array.from() convierte cualquier iterable en un array
    onChange(Array.from(currentSet));
  };

  /**
   * FUNCIÓN HELPER: Seleccionar todas las declinaciones
   */
  const selectAll = () => {
    // Object.keys obtiene todas las claves del objeto como array
    const allDeclensions = Object.keys(declensionInfo) as Declension[];
    onChange(allDeclensions);
  };

  /**
   * FUNCIÓN HELPER: Limpiar selección
   */
  const clearAll = () => {
    onChange([]);
  };

  /**
   * FUNCIÓN HELPER: Verificar si un chip está seleccionado
   */
  const isSelected = (declension: Declension): boolean => {
    return selectedDeclensions.includes(declension);
  };

  return (
    <Box>
      {/* ENCABEZADO CON CONTROLES */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Filtrar por Declinación
          </Typography>
        </Box>
        
        {/* BOTONES DE ACCIÓN RÁPIDA */}
        <Stack direction="row" spacing={1}>
          <Chip
            label="Todas"
            size="small"
            onClick={selectAll}
            disabled={disabled}
            variant={selectedDeclensions.length === 5 ? "filled" : "outlined"}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          />
          <Chip
            label="Ninguna"
            size="small"
            onClick={clearAll}
            disabled={disabled}
            variant={selectedDeclensions.length === 0 ? "filled" : "outlined"}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          />
        </Stack>
      </Box>

      {/* CHIPS DE DECLINACIÓN */}
      <Stack 
        direction={orientation === 'horizontal' ? 'row' : 'column'}
        spacing={1.5}
        flexWrap={orientation === 'horizontal' ? 'wrap' : 'nowrap'}
        sx={{ gap: orientation === 'horizontal' ? 1.5 : 0 }}
      >
        {(Object.entries(declensionInfo) as [Declension, typeof declensionInfo[Declension]][]).map(
          ([declension, info]) => {
            const selected = isSelected(declension);
            
            // El Chip principal, envuelto en Tooltip si showHelp es true
            const chipElement = (
              <Chip
                key={declension}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {info.label} Declinación
                    </Typography>
                    {selected && showHelp && (
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        ({info.example})
                      </Typography>
                    )}
                  </Box>
                }
                onClick={() => handleChipClick(declension)}
                disabled={disabled}
                // Color dinámico basado en selección
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                icon={selected ? <SchoolIcon /> : undefined}
                sx={{
                  // Tamaño más grande para mejor usabilidad
                  height: 'auto',
                  py: 0.5,
                  px: 1.5,
                  // Color de borde personalizado cuando está seleccionado
                  borderColor: selected ? info.color : 'divider',
                  bgcolor: selected ? info.color : 'transparent',
                  color: selected ? 'white' : 'text.primary',
                  // Animación suave
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  // Efecto hover
                  '&:hover': {
                    bgcolor: selected ? info.color : 'action.hover',
                    borderColor: info.color,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                  // Si está deshabilitado
                  '&.Mui-disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }
                }}
              />
            );

            // Si showHelp es true, envolver en Tooltip
            if (showHelp) {
              return (
                <Tooltip
                  key={declension}
                  title={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {info.label} Declinación
                      </Typography>
                      <Typography variant="caption">
                        {info.description}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                        Ejemplo: {info.example}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  {chipElement}
                </Tooltip>
              );
            }

            return chipElement;
          }
        )}
      </Stack>

      {/* CONTADOR DE SELECCIÓN */}
      {selectedDeclensions.length > 0 && (
        <Paper 
          sx={{ 
            mt: 2, 
            p: 1.5, 
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {selectedDeclensions.length === 5 
              ? 'Todas las declinaciones seleccionadas'
              : `${selectedDeclensions.length} declinación${selectedDeclensions.length !== 1 ? 'es' : ''} seleccionada${selectedDeclensions.length !== 1 ? 's' : ''}`
            }
          </Typography>
          {showHelp && selectedDeclensions.length > 0 && selectedDeclensions.length < 5 && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Seleccionadas: {selectedDeclensions.map(d => declensionInfo[d].label).join(', ')}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

// Exportar el componente
export default DeclensionFilter;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. CHIPS INTERACTIVOS:
 *    - Elementos visuales para selección múltiple
 *    - Más atractivos que checkboxes tradicionales
 *    - Pueden tener iconos, colores, y estados
 * 
 * 2. SET DE JAVASCRIPT:
 *    - Estructura de datos para valores únicos
 *    - has(), add(), delete() son O(1) - muy eficientes
 *    - Mejor que array para verificar membresía
 * 
 * 3. TOOLTIP COMPONENT:
 *    - Muestra información adicional al hover
 *    - Útil para dar contexto sin saturar la UI
 *    - Mejora la experiencia de aprendizaje
 * 
 * 4. OBJECT.ENTRIES & TYPE CASTING:
 *    - Object.entries convierte objeto a array de [key, value]
 *    - Type casting con 'as' para TypeScript
 *    - Permite iterar sobre objetos tipados
 * 
 * 5. CONDITIONAL WRAPPING:
 *    - Envolver componentes condicionalmente (Tooltip)
 *    - Evita duplicación de código
 *    - Patrón útil para features opcionales
 * 
 * 6. DYNAMIC STYLING:
 *    - Colores y estilos basados en estado
 *    - Transiciones CSS para suavidad
 *    - Feedback visual claro para el usuario
 */