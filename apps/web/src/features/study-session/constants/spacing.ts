/**
 * CENTRALIZED SPACING CONSTANTS
 * 
 * Consistent spacing values used throughout the application.
 * These values ensure visual consistency across all components.
 * 
 * MUI uses a base spacing of 8px:
 * - spacing(1) = 8px
 * - spacing(2) = 16px
 * - spacing(3) = 24px
 * - etc.
 */

/**
 * SPACING VALUES
 * Numeric values for use with MUI's sx prop spacing properties
 */
export const SPACING = {
  // Component internal padding - más compacto en móvil
  cardPadding: { xs: 1.5, sm: 2.5, md: 3 },           // 12px mobile, 20px tablet, 24px desktop
  cardPaddingCompact: { xs: 1, sm: 1.5, md: 2 },      // 8px mobile, 12px tablet, 16px desktop
  buttonPadding: { x: { xs: 3, sm: 4 }, y: { xs: 1, sm: 1.5 } },  // Botones más pequeños en móvil
  
  // Margins between elements - reducidos para móvil
  elementGap: { xs: 1, sm: 1.5 },         // 8px mobile, 12px desktop
  sectionGap: { xs: 1.5, sm: 2, md: 2.5 }, // 12px mobile, 16px tablet, 20px desktop
  componentGap: { xs: 2, sm: 2.5, md: 3 }, // 16px mobile, 20px tablet, 24px desktop
  
  // Specific use cases - más compactos
  optionSpacing: { xs: 1, sm: 1.5 },      // 8px mobile, 12px desktop - entre opciones
  chipSpacing: { xs: 0.5, sm: 1 },        // 4px mobile, 8px desktop - entre chips
  iconTextGap: { xs: 0.5, sm: 1 },        // 4px mobile, 8px desktop - entre icono y texto
  
  // Container padding
  containerPadding: { xs: 1.5, sm: 2.5, md: 3, lg: 4 },  // Menos padding en móvil
  
  // Section margins - más compactos en móvil
  headerMargin: { mb: { xs: 2, sm: 2.5, md: 3 } },     // Menos margen después de headers
  dividerMargin: { my: { xs: 1.5, sm: 2, md: 2.5 } },  // Menos margen alrededor de dividers
  feedbackMargin: { mt: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }, // Menos margen para feedback
} as const;

/**
 * COMMON HEIGHTS
 * Fixed heights for consistency across components
 */
export const HEIGHTS = {
  // Word card heights
  wordCardExercise: { xs: 120, sm: 140, md: 160, lg: 170, xl: 180 },
  wordCardMinimal: { xs: 250, sm: 280, md: 300 },
  wordCardCompact: { xs: 100, sm: 110, md: 120 },
  wordCardFull: { xs: 320, sm: 350, md: 380 },
  
  // Question card heights
  questionCard: { xs: 100, sm: 120, md: 140 },
  
  // Container heights for study session
  // Aumentado significativamente para pantallas medianas y grandes
  // para que los ejercicios se muestren correctamente
  studyContainer: { xs: 600, sm: 650, md: 750, lg: 850, xl: 950 },
} as const;

/**
 * COMMON WIDTHS
 * Fixed widths for consistency
 */
export const WIDTHS = {
  // Exercise components
  exerciseContainer: { xs: '100%', sm: 450, md: 500, lg: 550, xl: 600 },
  
  // Word cards
  wordCardMaxWidth: { xs: '100%', sm: 500, md: 550 },
  wordCardCompactMaxWidth: { xs: '100%', sm: 400, md: 450 },
  
  // Buttons
  buttonMinWidth: 120,
} as const;

/**
 * BORDER RADIUS
 * Consistent corner rounding
 */
export const RADIUS = {
  small: 1,      // 8px (1 * theme.shape.borderRadius)
  medium: 1.5,   // 12px
  large: 2,      // 16px
  rounded: 3,    // 24px - for pills/chips
} as const;

/**
 * COMMON SX STYLES
 * Pre-composed style objects for common patterns
 */
export const COMMON_STYLES = {
  // Centered flex container
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Column flex with gap
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.elementGap,
  },
  
  // Full height container
  fullHeight: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Card hover effect
  cardHover: {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 3,
    },
  },
  
  // Subtle background for sections
  subtleBackground: {
    bgcolor: 'action.hover',
    borderRadius: RADIUS.medium,
    p: SPACING.cardPaddingCompact,
  },
} as const;