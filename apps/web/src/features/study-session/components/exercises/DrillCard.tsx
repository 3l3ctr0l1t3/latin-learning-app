/**
 * DRILL CARD WRAPPER COMPONENT
 * 
 * Componente contenedor genérico para todas las tarjetas de ejercicio.
 * Proporciona un diseño consistente con encabezado, contenido y estilo unificado.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Wrapper Component: Envuelve otros componentes para dar estilo consistente
 * - children prop: Permite pasar cualquier contenido como hijo
 * - Composition pattern: Componer componentes más grandes desde más pequeños
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import { SPACING, RADIUS } from '../../constants/spacing';

/**
 * PROPS DEL DRILL CARD
 */
interface DrillCardProps {
  // Información del ejercicio
  title: string;                    // Título del tipo de ejercicio
  subtitle?: string;                 // Instrucción o descripción
  icon?: React.ReactNode;           // Icono para el tipo de ejercicio
  exerciseType?: string;            // Etiqueta del tipo (ej: "Latín → Español")
  
  // Contenido
  children: React.ReactNode;        // El ejercicio en sí
  
  // Configuración visual
  elevation?: number;               // Elevación del Paper (sombra)
  maxWidth?: any;                   // Ancho máximo del card
  noPadding?: boolean;             // Si true, no aplica padding al contenido
  compact?: boolean;               // Versión compacta con menos espaciado
}

/**
 * DRILL CARD - CONTENEDOR PARA EJERCICIOS
 * 
 * Proporciona un contenedor consistente para todos los tipos de ejercicios
 * con encabezado, estilo y espaciado unificados.
 */
const DrillCard: React.FC<DrillCardProps> = ({
  title,
  subtitle,
  icon,
  exerciseType,
  children,
  elevation = 3,
  maxWidth = { xs: '100%', sm: 450, md: 500, lg: 550, xl: 600 },
  noPadding = false,
  compact = false
}) => {

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth, 
        mx: 'auto' 
      }} 
      data-testid="drill-card"
    >
      <Paper
        elevation={elevation}
        sx={{
          p: compact ? SPACING.cardPaddingCompact : SPACING.cardPadding,
          borderRadius: RADIUS.large,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          // Transición suave para efectos hover si se necesitan
          transition: 'all 0.3s ease',
        }}
      >
        {/* ENCABEZADO DEL EJERCICIO */}
        {(title || exerciseType) && (
          <>
            <Box 
              sx={{ 
                mb: compact ? 2 : SPACING.componentGap, 
                textAlign: 'center' 
              }} 
              data-testid="drill-card-header"
            >
              {/* Tipo de ejercicio con icono */}
              {(icon || exerciseType) && (
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={1} 
                  justifyContent="center"
                  sx={{ mb: 0.5 }}
                >
                  {icon}
                  {exerciseType && (
                    <Chip 
                      label={exerciseType}
                      color="secondary"
                      size="small"
                    />
                  )}
                </Stack>
              )}
              
              {/* Título principal */}
              {title && (
                <Typography 
                  variant={compact ? "body1" : "h6"}
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: subtitle ? 0.5 : 0
                  }}
                  data-testid="drill-card-title"
                >
                  {title}
                </Typography>
              )}
              
              {/* Subtítulo/Instrucción */}
              {subtitle && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: compact ? '0.75rem' : '0.85rem' }}
                  data-testid="drill-card-subtitle"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ mb: SPACING.sectionGap }} />
          </>
        )}
        
        {/* CONTENIDO DEL EJERCICIO */}
        <Box 
          sx={{ 
            p: noPadding ? 0 : undefined 
          }}
          data-testid="drill-card-content"
        >
          {children as any}
        </Box>
      </Paper>
    </Box>
  );
};

export default DrillCard;

/**
 * RESUMEN DE CONCEPTOS:
 * 
 * 1. WRAPPER PATTERN:
 *    - Envuelve componentes hijos con estilo consistente
 *    - Reutilizable para diferentes tipos de contenido
 *    - Mantiene la consistencia visual
 * 
 * 2. CHILDREN PROP:
 *    - Prop especial de React para pasar componentes hijos
 *    - Permite composición flexible
 *    - El contenido se renderiza donde se coloca {children}
 * 
 * 3. OPTIONAL PROPS:
 *    - Valores por defecto para props opcionales
 *    - Permite personalización cuando se necesita
 *    - Mantiene simplicidad en uso básico
 * 
 * 4. COMPOSICIÓN:
 *    - Este componente se puede componer con cualquier ejercicio
 *    - Separa la presentación (card) del contenido (ejercicio)
 *    - Facilita crear nuevos tipos de ejercicios con el mismo estilo
 */