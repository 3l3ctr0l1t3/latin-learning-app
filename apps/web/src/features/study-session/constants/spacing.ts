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
  // Component internal padding
  cardPadding: { xs: 2, sm: 3 },           // 16px mobile, 24px desktop
  cardPaddingCompact: { xs: 1.5, sm: 2 },  // 12px mobile, 16px desktop
  buttonPadding: { x: 4, y: 1.5 },         // 32px horizontal, 12px vertical
  
  // Margins between elements
  elementGap: 1.5,         // 12px - between related elements
  sectionGap: 2.5,         // 20px - between sections within a component
  componentGap: 3,         // 24px - between major components
  
  // Specific use cases
  optionSpacing: 1.5,      // 12px - between multiple choice options
  chipSpacing: 1,          // 8px - between chips
  iconTextGap: 1,          // 8px - between icon and text
  
  // Container padding
  containerPadding: { xs: 2, sm: 3, md: 4 },  // Responsive container padding
  
  // Section margins
  headerMargin: { mb: 3 },          // 24px - after headers
  dividerMargin: { my: 2.5 },       // 20px - around dividers
  feedbackMargin: { mt: 2, mb: 2 }, // 16px - around feedback messages
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
  studyContainer: { xs: 600, sm: 600, md: 600, lg: 650, xl: 700 },
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