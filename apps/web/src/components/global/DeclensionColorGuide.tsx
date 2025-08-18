/**
 * DECLENSION COLOR GUIDE COMPONENT
 * 
 * Componente reutilizable que muestra la guía de colores por declinación.
 * Se puede usar en la homepage, en modales de ayuda, o cualquier lugar
 * donde se necesite explicar el sistema de colores.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Reusable Component: Diseñado para ser usado en múltiples lugares
 * - Responsive Design: Se adapta a diferentes tamaños de pantalla
 * - Prop Configuration: Permite personalizar título, descripción y layout
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// Usar la información de declinaciones centralizada
import { DECLENSION_INFO } from '../../features/study-session/constants/colors';

/**
 * PROPS DEL COMPONENTE
 */
interface DeclensionColorGuideProps {
  title?: string;                      // Título personalizable
  showTitle?: boolean;                 // Mostrar/ocultar título
  description?: string;                // Descripción personalizable
  showDescription?: boolean;           // Mostrar/ocultar descripción
  showTip?: boolean;                   // Mostrar/ocultar el tip al final
  compact?: boolean;                   // Versión compacta
  columns?: {                          // Control de columnas por breakpoint
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  elevation?: number;                  // Elevación del Paper principal
  showDivider?: boolean;               // Mostrar divider entre título y contenido
}

/**
 * DECLENSION COLOR GUIDE COMPONENT
 * 
 * Muestra una guía visual del sistema de colores por declinación
 */
const DeclensionColorGuide: React.FC<DeclensionColorGuideProps> = ({
  title = 'Sistema de Colores por Declinación',
  showTitle = true,
  description = 'En toda la aplicación, las palabras latinas están codificadas por colores según su declinación. Este sistema visual te ayuda a identificar rápidamente patrones y memorizar las terminaciones características de cada grupo.',
  showDescription = true,
  showTip = true,
  compact = false,
  columns = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 2.4,
    xl: 2.4
  },
  elevation = 2,
  showDivider = true
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <Paper 
      elevation={elevation}
      sx={{ 
        p: compact ? { xs: 2, sm: 3 } : { xs: 3, sm: 4, md: 5 },
        bgcolor: 'background.paper',
        borderRadius: 2
      }}
      data-testid="declension-color-guide"
    >
      {/* TÍTULO DE LA SECCIÓN */}
      {showTitle && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: compact ? 2 : 3
        }}>
          <InfoOutlinedIcon sx={{ 
            mr: 1, 
            color: 'primary.main',
            fontSize: compact ? 20 : 24
          }} />
          <Typography 
            variant={compact ? 'h6' : (isMdUp ? 'h5' : 'h6')}
            sx={{ fontWeight: 'medium' }}
          >
            {title}
          </Typography>
        </Box>
      )}
      
      {/* DESCRIPCIÓN */}
      {showDescription && description && (
        <Typography 
          variant={compact ? 'body2' : 'body1'}
          sx={{ 
            mb: compact ? 3 : 4,
            color: 'text.secondary'
          }}
        >
          {description}
        </Typography>
      )}
      
      {/* DIVIDER */}
      {showDivider && (showTitle || showDescription) && (
        <Divider sx={{ mb: compact ? 2 : 3 }} />
      )}
      
      {/* GRID DE DECLINACIONES */}
      <Grid 
        container 
        spacing={compact ? 1.5 : { xs: 2, md: 3 }}
      >
        {Object.entries(DECLENSION_INFO).map(([key, info]) => (
          <Grid 
            item 
            xs={columns.xs} 
            sm={columns.sm} 
            md={columns.md} 
            lg={columns.lg}
            xl={columns.xl}
            key={key}
          >
            <DeclensionCard 
              info={info} 
              compact={compact}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* TIP ADICIONAL */}
      {showTip && (
        <Box sx={{ 
          mt: compact ? 3 : 4, 
          p: compact ? 1.5 : 2, 
          bgcolor: 'action.hover',
          borderRadius: 1
        }}>
          <Typography 
            variant={compact ? 'caption' : 'body2'} 
            sx={{ color: 'text.secondary' }}
          >
            <strong>Tip:</strong> Presta atención a estos colores mientras estudias. 
            Con el tiempo, asociarás automáticamente cada color con las terminaciones 
            y patrones de su declinación, acelerando tu aprendizaje.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

/**
 * COMPONENTE INTERNO: TARJETA DE DECLINACIÓN
 * 
 * Tarjeta individual para cada declinación
 */
interface DeclensionCardProps {
  info: typeof DECLENSION_INFO[keyof typeof DECLENSION_INFO];
  compact: boolean;
}

const DeclensionCard: React.FC<DeclensionCardProps> = ({ info, compact }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: compact ? 1.5 : 2,
        height: '100%',
        border: '2px solid',
        borderColor: info.color,
        bgcolor: `${info.color}10`,  // Color con transparencia
        transition: 'all 0.3s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 20px ${info.color}40`
        }
      }}
      data-testid={`declension-card-${info.shortLabel}`}
    >
      {/* CHIP con el número de declinación */}
      <Chip
        label={compact ? info.shortLabel : info.label}
        size="small"
        sx={{
          bgcolor: info.color,
          color: 'white',
          fontWeight: 'bold',
          mb: compact ? 1 : 1.5,
          fontSize: compact ? '0.7rem' : '0.75rem'
        }}
      />
      
      {/* EJEMPLO de palabra */}
      <Typography 
        variant={compact ? 'body2' : 'subtitle1'}
        sx={{ 
          fontWeight: 'bold',
          color: info.color,
          mb: 0.5,
          fontSize: compact ? '0.9rem' : undefined
        }}
      >
        {info.example}
      </Typography>
      
      {/* DESCRIPCIÓN */}
      <Typography 
        variant="caption"
        sx={{ 
          display: 'block',
          color: 'text.secondary',
          lineHeight: 1.4,
          fontSize: compact ? '0.7rem' : '0.75rem'
        }}
      >
        {info.description}
      </Typography>
      
      {/* TERMINACIONES COMUNES */}
      {!compact && (
        <Box sx={{ mt: 1 }}>
          <Typography 
            variant="caption"
            sx={{ 
              fontSize: '0.7rem',
              color: 'text.secondary'
            }}
          >
            Terminaciones:
          </Typography>
          <Typography 
            variant="caption"
            sx={{ 
              display: 'block',
              fontWeight: 'medium',
              color: info.color,
              fontSize: '0.75rem'
            }}
          >
            {info.commonEndings.join(', ')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DeclensionColorGuide;

/**
 * EJEMPLOS DE USO:
 * 
 * // Uso básico con todas las opciones por defecto
 * <DeclensionColorGuide />
 * 
 * // Versión compacta sin título ni descripción
 * <DeclensionColorGuide 
 *   showTitle={false}
 *   showDescription={false}
 *   compact={true}
 * />
 * 
 * // Personalizar columnas para un modal
 * <DeclensionColorGuide
 *   columns={{ xs: 12, sm: 12, md: 6 }}
 *   title="Guía Rápida de Colores"
 * />
 * 
 * // Sin tip y con título personalizado
 * <DeclensionColorGuide
 *   title="Colores de Declinación"
 *   description="Cada declinación tiene un color único"
 *   showTip={false}
 * />
 */