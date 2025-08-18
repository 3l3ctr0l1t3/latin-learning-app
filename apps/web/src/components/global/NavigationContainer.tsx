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
import { Box, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
  
  // Control de navegación lateral para tarjetas (flechas izquierda/derecha)
  onCardPrevious?: () => void;            // Callback para navegar a tarjeta anterior
  onCardNext?: () => void;                // Callback para navegar a tarjeta siguiente
  showCardNavigation?: boolean;           // Si mostrar flechas de navegación de tarjetas
  cardNavigationDisabled?: boolean;       // Si las flechas están deshabilitadas
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
  nextVariant = 'contained',
  onCardPrevious,
  onCardNext,
  showCardNavigation = false,
  cardNavigationDisabled = false
}) => {
  // Hook para detectar el tamaño de pantalla
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md')); // Pantallas md y superiores
  
  // Mostrar flechas solo en pantallas md y superiores (no en xs/sm)
  const shouldShowCardArrows = showCardNavigation && isMediumUp;
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
      {/* CONTENIDO PRINCIPAL CON FLECHAS DE NAVEGACIÓN */}
      <Box 
        sx={{ 
          flexGrow: 1,  // Toma todo el espacio disponible
          overflowY: 'auto',  // Scroll si el contenido es largo
          overflowX: 'hidden',
          pb: { xs: 1, md: 2 },  // Menos padding en móvil
          position: 'relative',  // Para posicionar las flechas
          display: 'flex',
          alignItems: 'center'
        }}
        data-testid="navigation-content-area"
      >
        {/* FLECHA IZQUIERDA (Solo en md-xl) */}
        {shouldShowCardArrows && (
          <IconButton
            onClick={onCardPrevious}
            disabled={cardNavigationDisabled}
            sx={{
              position: 'absolute',
              left: { md: 8, lg: 16 },  // Más espacio en pantallas grandes
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              opacity: cardNavigationDisabled ? 0.3 : 0.8,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: cardNavigationDisabled ? 0.3 : 1,
                bgcolor: 'action.hover'
              },
              // Ocultar en pantallas pequeñas y muy grandes
              display: { xs: 'none', sm: 'none', md: 'flex', xl: 'flex' }
            }}
            data-testid="card-navigation-previous"
            aria-label="Palabra anterior"
          >
            <NavigateBeforeIcon />
          </IconButton>
        )}
        
        {/* CONTENIDO CENTRAL */}
        <Box sx={{ 
          width: '100%',
          px: shouldShowCardArrows ? { md: 7, lg: 8 } : 0  // Espacio para las flechas
        }}>
          {children as any}
        </Box>
        
        {/* FLECHA DERECHA (Solo en md-xl) */}
        {shouldShowCardArrows && (
          <IconButton
            onClick={onCardNext}
            disabled={cardNavigationDisabled}
            sx={{
              position: 'absolute',
              right: { md: 8, lg: 16 },  // Más espacio en pantallas grandes
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              opacity: cardNavigationDisabled ? 0.3 : 0.8,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: cardNavigationDisabled ? 0.3 : 1,
                bgcolor: 'action.hover'
              },
              // Ocultar en pantallas pequeñas y muy grandes
              display: { xs: 'none', sm: 'none', md: 'flex', xl: 'flex' }
            }}
            data-testid="card-navigation-next"
            aria-label="Palabra siguiente"
          >
            <NavigateNextIcon />
          </IconButton>
        )}
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