/**
 * DRILL TYPE SELECTOR COMPONENT
 * 
 * Este componente permite al usuario seleccionar qué tipos de ejercicios
 * quiere practicar durante su sesión de estudio.
 * 
 * CONCEPTOS WEB IMPORTANTES:
 * - Checkbox: Un elemento de formulario que puede estar marcado o desmarcado
 * - FormGroup: Agrupa varios checkboxes relacionados
 * - Controlled Component: El estado del componente es controlado por React, no por el DOM
 */

import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper
} from '@mui/material';

// Importamos los iconos para hacer más visual cada tipo de ejercicio
import QuizIcon from '@mui/icons-material/Quiz'; // Icono para opción múltiple
import EditIcon from '@mui/icons-material/Edit'; // Icono para llenar espacios
import KeyboardIcon from '@mui/icons-material/Keyboard'; // Icono para entrada directa

// Importamos el tipo DrillType desde nuestro archivo de tipos
// Esto es mejor práctica que definirlo aquí porque evita problemas de importación
import type { DrillType } from '../types';

/**
 * CONFIGURACIÓN DE EJERCICIOS
 * Este objeto contiene toda la información sobre cada tipo de ejercicio.
 * Es una buena práctica mantener esta configuración separada del componente
 * para facilitar cambios futuros y traducciones.
 */
const drillTypeConfig: Record<DrillType, {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = {
  multipleChoice: {
    label: 'Opción Múltiple',
    description: 'Selecciona la respuesta correcta entre varias opciones',
    icon: <QuizIcon />,
    color: '#BB86FC' // Color púrpura del tema
  },
  fillInBlank: {
    label: 'Llenar Espacios',
    description: 'Completa la palabra o frase que falta',
    icon: <EditIcon />,
    color: '#03DAC6' // Color cyan del tema
  },
  directInput: {
    label: 'Entrada Directa',
    description: 'Escribe la respuesta completa',
    icon: <KeyboardIcon />,
    color: '#CF6679' // Color rojo/rosa del tema
  }
};

/**
 * PROPS INTERFACE
 * Define qué propiedades recibe este componente desde su componente padre
 * 
 * - value: Array de strings con los tipos seleccionados actualmente
 * - onChange: Función callback que se ejecuta cuando cambia la selección
 * - disabled: Opcional, desactiva todos los checkboxes si es true
 */
interface DrillTypeSelectorProps {
  value: DrillType[]; // Array porque puede haber múltiples seleccionados
  onChange: (types: DrillType[]) => void; // Callback que recibe el nuevo array
  disabled?: boolean; // El ? significa que es opcional
}

/**
 * COMPONENTE PRINCIPAL: DrillTypeSelector
 * 
 * React.FC significa "Function Component" - es un componente funcional
 * Los componentes funcionales son la forma moderna de crear componentes en React
 * (antes se usaban clases, pero ahora se prefieren funciones)
 */
const DrillTypeSelector: React.FC<DrillTypeSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false // Valor por defecto si no se proporciona
}) => {
  /**
   * MANEJADOR DE CAMBIOS
   * Esta función se ejecuta cuando el usuario marca o desmarca un checkbox
   * 
   * @param drillType - El tipo de ejercicio que fue clickeado
   * 
   * LÓGICA:
   * 1. Verifica si el tipo ya está en el array de seleccionados
   * 2. Si está, lo quita (filter lo elimina)
   * 3. Si no está, lo agrega (spread operator ... copia el array y añade el nuevo)
   */
  const handleChange = (drillType: DrillType) => {
    // Verificar si el tipo ya está seleccionado
    const isCurrentlySelected = value.includes(drillType);
    
    if (isCurrentlySelected) {
      // Si está seleccionado, lo quitamos del array
      // filter() crea un nuevo array sin el elemento especificado
      const newTypes = value.filter(type => type !== drillType);
      onChange(newTypes);
    } else {
      // Si no está seleccionado, lo agregamos al array
      // El spread operator (...) copia todos los elementos existentes
      // y luego agregamos el nuevo al final
      const newTypes = [...value, drillType];
      onChange(newTypes);
    }
  };

  /**
   * FUNCIÓN HELPER: Verificar si al menos uno está seleccionado
   * Usamos esto para mostrar un mensaje de ayuda si no hay ninguno seleccionado
   */
  const hasSelection = value.length > 0;

  return (
    // Box es como un <div> con superpoderes de estilo
    <Box>
      {/* Título del selector */}
      <Typography 
        variant="subtitle1" 
        gutterBottom // Agrega margen inferior automáticamente
        sx={{ 
          fontWeight: 'bold',
          color: 'text.primary',
          mb: 1 // margin-bottom adicional (1 = 8px)
        }}
      >
        Tipos de Ejercicios
      </Typography>

      {/* Mensaje de ayuda condicional */}
      {/* El operador && significa: si hasSelection es false, muestra el mensaje */}
      {!hasSelection && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'warning.main',
            display: 'block',
            mb: 2
          }}
        >
          ⚠️ Selecciona al menos un tipo de ejercicio
        </Typography>
      )}

      {/* FormGroup agrupa checkboxes relacionados */}
      {/* Es importante para accesibilidad (screen readers) */}
      <FormGroup>
        {/* Object.entries convierte un objeto en array de [clave, valor] */}
        {/* Esto nos permite iterar sobre drillTypeConfig */}
        {(Object.entries(drillTypeConfig) as [DrillType, typeof drillTypeConfig[DrillType]][]).map(
          ([drillType, config]) => (
            // Paper crea una tarjeta elevada para cada opción
            <Paper
              key={drillType} // React necesita una key única para cada elemento en un map
              elevation={1} // Nivel de sombra (1 es sutil)
              sx={{
                mb: 2, // margin-bottom entre tarjetas
                p: { xs: 1.5, sm: 2 }, // padding responsivo
                // Cambiar el fondo cuando está seleccionado
                bgcolor: value.includes(drillType) 
                  ? 'action.selected' // Color de fondo para elementos seleccionados
                  : 'background.paper', // Color de fondo normal
                // Añadir borde cuando está seleccionado
                border: value.includes(drillType) ? 2 : 0,
                borderColor: config.color,
                // Transición suave para los cambios de estilo
                transition: 'all 0.3s ease',
                // Efecto hover (cuando el mouse está encima)
                '&:hover': {
                  bgcolor: 'action.hover',
                  cursor: 'pointer'
                }
              }}
            >
              {/* FormControlLabel conecta un label con un control de formulario */}
              <FormControlLabel
                control={
                  // El Checkbox en sí
                  <Checkbox
                    checked={value.includes(drillType)} // true si está en el array
                    onChange={() => handleChange(drillType)} // Llamar al manejador
                    disabled={disabled} // Desactivar si el prop disabled es true
                    sx={{
                      // Color personalizado cuando está marcado
                      color: config.color,
                      '&.Mui-checked': {
                        color: config.color,
                      }
                    }}
                  />
                }
                // El label es lo que se muestra junto al checkbox
                label={
                  // Box con flexbox para organizar icono y textos
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Icono con color */}
                    <Box sx={{ color: config.color, display: 'flex' }}>
                      {config.icon}
                    </Box>
                    
                    {/* Textos del label */}
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {config.label}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block' // caption es inline por defecto, lo hacemos block
                        }}
                      >
                        {config.description}
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{
                  width: '100%', // Ocupa todo el ancho disponible
                  margin: 0, // Quitar márgenes por defecto
                }}
              />
            </Paper>
          )
        )}
      </FormGroup>

      {/* Resumen de selección - muestra qué está seleccionado */}
      {hasSelection && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Seleccionados: {value.length} tipo{value.length !== 1 ? 's' : ''} de ejercicio
            {/* El operador ternario añade 's' para plural si hay más de 1 */}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Exportar el componente para poder usarlo en otros archivos
export default DrillTypeSelector;

/**
 * RESUMEN DE CONCEPTOS APRENDIDOS:
 * 
 * 1. CHECKBOXES vs RADIO BUTTONS:
 *    - Checkboxes: Selección múltiple (varios pueden estar marcados)
 *    - Radio buttons: Selección única (solo uno puede estar marcado)
 * 
 * 2. CONTROLLED COMPONENTS:
 *    - El estado vive en React (value prop)
 *    - Los cambios se manejan con callbacks (onChange prop)
 *    - El componente no mantiene su propio estado interno
 * 
 * 3. ARRAY METHODS:
 *    - includes(): Verifica si un elemento está en el array
 *    - filter(): Crea un nuevo array sin ciertos elementos
 *    - map(): Transforma cada elemento del array
 *    - Spread operator (...): Copia elementos de un array
 * 
 * 4. CONDITIONAL RENDERING:
 *    - && operator: Muestra algo solo si la condición es true
 *    - Ternary operator (? :): Elige entre dos opciones
 * 
 * 5. MUI COMPONENTS:
 *    - FormGroup: Agrupa controles de formulario relacionados
 *    - FormControlLabel: Conecta un label con un control
 *    - Checkbox: Control para selección múltiple
 *    - Paper: Crea una superficie elevada (tarjeta)
 */