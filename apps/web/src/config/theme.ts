/**
 * MATERIAL-UI THEME CONFIGURATION
 * 
 * This file defines the visual appearance of our application.
 * Material-UI (MUI) uses a "theme" to control colors, typography, spacing, etc.
 * 
 * Think of a theme like CSS variables that work everywhere in your app.
 * Instead of hardcoding colors in each component, we define them once here.
 */

// Import the theme creation function from MUI
import { createTheme } from '@mui/material/styles';

/**
 * Create our custom dark theme
 * 
 * createTheme() is a MUI function that generates a complete theme object
 * We pass in our customizations, and it fills in the rest with defaults
 */
export const darkTheme = createTheme({
  // palette defines all the colors in our app
  palette: {
    // 'dark' mode makes backgrounds dark and text light
    mode: 'dark',
    
    // Primary color - used for main actions and emphasis
    // Purple for our Latin learning app
    primary: {
      // main is the default shade
      main: '#BB86FC',  // Light purple
      // light and dark are calculated automatically but can be overridden
      light: '#D4A5FF',
      dark: '#9965F4',
      // contrastText is the text color on top of primary color
      contrastText: '#000000',
    },
    
    // Secondary color - used for secondary actions
    // Cyan/Teal for contrast with purple
    secondary: {
      main: '#03DAC6',  // Cyan
      light: '#66FFF0',
      dark: '#00A896',
      contrastText: '#000000',
    },
    
    // Error color - used for error states and messages
    error: {
      main: '#CF6679',  // Soft red for dark theme
    },
    
    // Warning color - used for warning states
    warning: {
      main: '#FF9800',  // Orange
    },
    
    // Success color - used for success states
    success: {
      main: '#4CAF50',  // Green
    },
    
    // Info color - used for informational messages
    info: {
      main: '#2196F3',  // Blue
    },
    
    // Background colors for surfaces
    background: {
      // default is the main background (like <body>)
      default: '#121212',  // Very dark grey
      // paper is for elevated surfaces (like cards, dialogs)
      paper: '#1E1E1E',    // Slightly lighter grey
    },
    
    // Text colors with different emphasis levels
    text: {
      // primary has the highest emphasis (87% opacity white)
      primary: 'rgba(255, 255, 255, 0.87)',
      // secondary has medium emphasis (60% opacity)
      secondary: 'rgba(255, 255, 255, 0.60)',
      // disabled has the lowest emphasis (38% opacity)
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
    
    // Divider lines between content
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  
  // Typography defines font styles
  typography: {
    // Font family - using system fonts for better performance
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),  // join() creates a comma-separated string
    
    // Heading styles
    h1: {
      fontSize: '3rem',      // 48px
      fontWeight: 300,       // Light
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.5rem',    // 40px
      fontWeight: 300,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '2rem',      // 32px
      fontWeight: 400,       // Regular
    },
    h4: {
      fontSize: '1.75rem',   // 28px
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.5rem',    // 24px
      fontWeight: 400,
    },
    h6: {
      fontSize: '1.25rem',   // 20px
      fontWeight: 500,       // Medium
    },
    
    // Body text
    body1: {
      fontSize: '1rem',      // 16px - main body text
    },
    body2: {
      fontSize: '0.875rem',  // 14px - smaller body text
    },
    
    // Button text
    button: {
      textTransform: 'none', // Don't auto-capitalize (MUI default is uppercase)
      fontWeight: 500,
    },
  },
  
  // Shape defines border radius (rounded corners)
  shape: {
    borderRadius: 12,  // More rounded corners (default is 4)
  },
  
  // Spacing defines the spacing scale
  // MUI uses multiples of 8px by default
  // spacing(1) = 8px, spacing(2) = 16px, etc.
  spacing: 8,
  
  // Component-specific overrides
  components: {
    // Customize the MuiButton component
    MuiButton: {
      styleOverrides: {
        root: {
          // Make buttons more rounded
          borderRadius: 24,
          // Add padding
          padding: '10px 24px',
          // Remove shadow by default (flat design)
          boxShadow: 'none',
          // Smooth transition for hover effects
          transition: 'all 0.3s ease',
          
          // Hover effect (& means "this element")
          '&:hover': {
            // Add shadow on hover
            boxShadow: '0 4px 8px rgba(187, 134, 252, 0.3)',
            // Slightly scale up
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    // Customize cards
    MuiCard: {
      styleOverrides: {
        root: {
          // Add subtle shadow to cards
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          // Smooth transitions
          transition: 'all 0.3s ease',
          
          '&:hover': {
            // Lift effect on hover
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    
    // Customize paper (base for many components)
    MuiPaper: {
      styleOverrides: {
        root: {
          // Remove harsh shadows
          backgroundImage: 'none',
        },
      },
    },
    
    // Customize app bar (top navigation)
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Remove shadow for flat design
          boxShadow: 'none',
          // Add border at bottom instead
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
});

/**
 * Export additional theme constants
 * These can be imported and used anywhere in the app
 */

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  short: 200,
  medium: 300,
  long: 500,
};

// Breakpoints for responsive design
// These match MUI's default breakpoints
export const BREAKPOINTS = {
  xs: 0,     // Extra small (mobile)
  sm: 600,   // Small (tablet portrait)
  md: 960,   // Medium (tablet landscape)
  lg: 1280,  // Large (desktop)
  xl: 1920,  // Extra large (wide desktop)
};