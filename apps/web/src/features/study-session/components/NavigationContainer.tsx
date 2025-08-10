/**
 * NAVIGATION CONTAINER COMPONENT
 * 
 * Contenedor reutilizable para navegación entre pasos.
 * Proporciona botones de Anterior/Siguiente con lógica personalizable.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Componente contenedor: Envuelve contenido y agrega navegación
 * - Props flexibles: Permite personalizar texto y comportamiento de botones
 * - Reutilizable: Se puede usar en diferentes contextos
 */

import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * PROPS DEL COMPONENTE
 */
interface NavigationContainerProps {
  // Contenido principal a mostrar
  children: React.ReactNode;
  
  // Control de navegación hacia atrás
  onBack?: () => void;                    // Callback para botón Anterior
  backLabel?: string;                     // Texto del botón (default: "Anterior")
  backDisabled?: boolean;                 // Si el botón está deshabilitado
  hideBack?: boolean;                     // Si ocultar el botón completamente
  
  // Control de navegación hacia adelante
  onNext?: () => void;                    // Callback para botón Siguiente
  nextLabel?: string;                     // Texto del botón (default: "Siguiente")
  nextDisabled?: boolean;                 // Si el botón está deshabilitado
  hideNext?: boolean;                     // Si ocultar el botón completamente
  nextVariant?: 'text' | 'outlined' | 'contained'; // Estilo del botón
}

/**
 * COMPONENTE DE CONTENEDOR CON NAVEGACIÓN
 * 
 * Envuelve cualquier contenido y agrega botones de navegación en la parte inferior
 */
const NavigationContainer: React.FC<NavigationContainerProps> = ({
  children,
  onBack,
  backLabel = 'Anterior',
  backDisabled = false,
  hideBack = false,
  onNext,
  nextLabel = 'Siguiente',
  nextDisabled = false,
  hideNext = false,
  nextVariant = 'contained'
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: { 
          xs: 'calc(100vh - 110px)',  // Móvil: altura completa
          sm: '500px'  // Desktop: altura mínima
        }
      }}
      data-testid="navigation-container"
    >
      {/* CONTENIDO PRINCIPAL */}
      <Box 
        sx={{ 
          flexGrow: 1,  // Toma todo el espacio disponible
          overflowY: 'auto',  // Scroll si el contenido es largo
          overflowX: 'hidden',
          pb: 2  // Padding inferior para separar del navigation
        }}
        data-testid="navigation-content-area"
      >
        {children as any}
      </Box>

      {/* BARRA DE NAVEGACIÓN */}
      {(!hideBack || !hideNext) && (
        <Box 
          sx={{ 
            mt: 'auto',  // Empuja la navegación al fondo
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex', 
            justifyContent: 'space-between',
            gap: 2
          }}
          data-testid="navigation-bar"
        >
          {/* BOTÓN ANTERIOR */}
          {!hideBack && (
            <Button
              startIcon={<ArrowBackIcon data-testid="back-button-icon" />}
              onClick={onBack}
              disabled={backDisabled}
              sx={{ 
                fontSize: { xs: '1rem', sm: '0.875rem' },
                py: { xs: 1.5, sm: 1 }
              }}
              data-testid="button-back"
            >
              {backLabel}
            </Button>
          )}
          
          {/* Espaciador si solo hay un botón */}
          {(hideBack || hideNext) && <Box data-testid="navigation-spacer" />}
          
          {/* BOTÓN SIGUIENTE */}
          {!hideNext && (
            <Button
              endIcon={<ArrowForwardIcon data-testid="next-button-icon" />}
              variant={nextVariant}
              onClick={onNext}
              disabled={nextDisabled}
              sx={{ 
                fontSize: { xs: '1rem', sm: '0.875rem' },
                py: { xs: 1.5, sm: 1 }
              }}
              data-testid="button-next"
            >
              {nextLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NavigationContainer;