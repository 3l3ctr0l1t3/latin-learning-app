/**
 * DASHBOARD COMPONENT - The Homepage of our Latin Learning App
 * 
 * This is a React Functional Component. In modern React, we write components
 * as functions instead of classes. The function returns JSX (JavaScript XML),
 * which looks like HTML but is actually JavaScript.
 * 
 * Components are like custom HTML elements that we can reuse.
 */

// Import React (required for JSX)
import React from 'react';

// Import centralized theme constants for consistent styling
// Usamos ruta relativa porque el alias @ no está configurado
import { LATIN_COLORS } from '../../../config/theme'; // SHADOWS removed - not being used

// Import Material-UI components
// These are pre-built components that follow Material Design guidelines
import {
  Box,           // Box is like a <div> with built-in styling props
  Container,     // Container centers content and adds margins
  Typography,   // Typography is for all text (replaces h1, h2, p, etc.)
  Button,       // Button component with Material Design styling
  Card,         // Card is a surface for content
  CardContent,  // CardContent adds padding inside a Card
  Grid,         // Grid helps create responsive layouts
  // IconButton,   // Button that shows just an icon - Removed - not being used
  Stack,        // Stack arranges items vertically or horizontally
  Chip,         // Chip is a small tag-like component
  LinearProgress, // Progress bar
} from '@mui/material';

// Import Material-UI icons
// Icons are imported individually for better performance (tree-shaking)
import {
  School as SchoolIcon,           // Book/education icon
  PlayArrow as PlayArrowIcon,     // Play button icon
  Book as BookIcon,                // Book icon
  Timer as TimerIcon,              // Timer/clock icon
  TrendingUp as TrendingUpIcon,   // Progress/trending icon
  Language as LanguageIcon,       // Language/globe icon
} from '@mui/icons-material';

/**
 * Dashboard Component
 * 
 * In TypeScript + React:
 * - React.FC means "React Functional Component"
 * - The <> after FC would contain prop types if we had props
 * - Since we have no props, we just use React.FC
 */
const Dashboard: React.FC = () => {
  // This is the component body where we can add logic
  // Any JavaScript code goes here, before the return statement
  
  // Example: Component state (we'll add real state later)
  // These are just placeholder values for now
  const userStats = {
    wordsLearned: 42,
    studyStreak: 5,
    totalSessions: 12,
    averageScore: 85,
  };
  
  // The return statement contains JSX - what the component displays
  return (
    // Container adds responsive margins and centers content
    // maxWidth="lg" means large max width (1280px)
    <Container maxWidth="lg" data-testid="dashboard">
      {/* Box is like a div with styling props */}
      {/* sx prop is for custom styles (like inline CSS but better) */}
      <Box sx={{ 
        // py = padding on Y axis (top and bottom)
        // The number is multiplied by 8px (theme spacing)
        // So py: 4 = 32px top and bottom padding
        py: 4,  
      }}>
        
        {/* HERO SECTION - The main welcome area */}
        <Box sx={{ 
          mb: 6,  // margin-bottom: 48px (6 * 8px)
          textAlign: 'center'  // Center all text
        }}>
          {/* Typography replaces HTML text elements */}
          {/* variant="h2" makes it look like an h2 */}
          {/* component="h1" makes it render as an h1 in HTML (for SEO) */}
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom  // Adds margin-bottom
            sx={{
              // Custom styles for this specific Typography
              fontWeight: 'bold',
              // Background gradient for text - using centralized gradient
              background: LATIN_COLORS.gradients.primary,
              // This makes the gradient show only on text
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,  // margin-bottom
            }}
          >
            Salve! {/* "Hello" in Latin */}
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary"  // Uses theme's secondary text color
            sx={{ mb: 4 }}
          >
            Bienvenido a tu viaje de aprendizaje del latín
          </Typography>
          
          {/* Button with icon */}
          <Button
            variant="contained"  // Filled button (vs "outlined" or "text")
            color="primary"      // Use primary color from theme
            size="large"
            startIcon={<PlayArrowIcon />}  // Icon before text
            sx={{ 
              px: 4,  // padding-left and padding-right
              py: 1.5,
            }}
          >
            Comenzar Sesión de Estudio
          </Button>
        </Box>
        
        {/* STATS SECTION - User progress cards */}
        {/* Grid container creates a responsive grid layout */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 6 }}>
          {/* Grid item takes up space based on screen size */}
          {/* xs=12 means full width on extra small screens */}
          {/* sm=6 means half width on small screens */}
          {/* md=3 means quarter width on medium+ screens */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                {/* Stack arranges items vertically */}
                <Stack spacing={1} alignItems="center">
                  <BookIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.wordsLearned}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Palabras Aprendidas
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <TrendingUpIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.studyStreak}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Días Consecutivos
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <TimerIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.totalSessions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sesiones Completadas
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <SchoolIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.averageScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Puntuación Promedio
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* QUICK ACTIONS SECTION */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Acciones Rápidas
        </Typography>
        
        <Grid container spacing={3}>
          {/* Study Session Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',  // Make all cards same height
                cursor: 'pointer',  // Show it's clickable
                transition: 'transform 0.2s',  // Smooth animation
                '&:hover': {  // & means "this element"
                  transform: 'scale(1.02)',  // Slightly grow on hover
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <PlayArrowIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Sesión de Estudio
                  </Typography>
                  <Typography color="text.secondary">
                    Practica con tarjetas y ejercicios interactivos
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label="5 min" size="small" />
                    <Chip label="10 min" size="small" />
                    <Chip label="15 min" size="small" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Vocabulary Browser Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <LanguageIcon color="secondary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Explorar Vocabulario
                  </Typography>
                  <Typography color="text.secondary">
                    Navega por las 690 palabras latinas disponibles
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label="1ª decl." size="small" variant="outlined" />
                    <Chip label="2ª decl." size="small" variant="outlined" />
                    <Chip label="3ª decl." size="small" variant="outlined" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Progress Review Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <TrendingUpIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Mi Progreso
                  </Typography>
                  <Typography color="text.secondary">
                    Revisa tu historial y estadísticas de aprendizaje
                  </Typography>
                  {/* Progress bar */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Nivel actual: Principiante
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={35} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* MOTIVATIONAL QUOTE */}
        <Box sx={{ 
          mt: 6, 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          background: LATIN_COLORS.gradients.subtle,  // Using centralized gradient
        }}>
          <Typography variant="h6" fontStyle="italic" gutterBottom>
            "Verba volant, scripta manent"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las palabras vuelan, los escritos permanecen
          </Typography>
        </Box>
        
      </Box>
    </Container>
  );
};

// Export the component so other files can import it
export default Dashboard;