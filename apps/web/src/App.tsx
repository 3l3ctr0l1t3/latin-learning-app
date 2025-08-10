/**
 * APP COMPONENT - The Root Component of our Application
 * 
 * This is the main component that wraps everything else.
 * Think of it as the <body> of your application.
 * All other components are children of this one.
 */

// Import React - not needed as separate import in React 17+

// Import Material-UI theme provider components
// ThemeProvider applies our theme to all child components
import { ThemeProvider } from '@mui/material/styles';

// CssBaseline resets browser default styles and applies baseline styles
// It's like CSS reset + normalize.css
import CssBaseline from '@mui/material/CssBaseline';

// Import our custom theme
import { darkTheme } from './config/theme';

// Import our Dashboard component
import Dashboard from './features/dashboard/components/Dashboard';

// Import our new ComponentCanvas for development
// This is our interactive development canvas where we can see and test components
import ComponentCanvas from './features/component-canvas/ComponentCanvas';

// Import our new PageCanvas for testing full pages
// This canvas shows complete pages with multiple components working together
import PageCanvas from './features/page-canvas/PageCanvas';

// Import React's useState hook to manage which view we're showing
import { useState } from 'react';

// Import Box and Button from MUI for layout and navigation
import { Box, Button, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// Import icons for better navigation
import WidgetsIcon from '@mui/icons-material/Widgets';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';

/**
 * App Component
 * 
 * This is the root of our component tree.
 * Every React app has one root component that contains all others.
 * We've added a simple navigation to switch between Dashboard and ComponentCanvas
 */
function App() {
  // Estado para controlar qué vista mostrar
  // 'dashboard' muestra el Dashboard principal
  // 'components' muestra el ComponentCanvas para desarrollo de componentes
  // 'pages' muestra el PageCanvas para desarrollo de páginas completas
  const [currentView, setCurrentView] = useState<'dashboard' | 'components' | 'pages'>('pages');
  
  // Estado para el drawer móvil
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Hook para detectar el tamaño de pantalla
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true si es móvil
  
  // Función para cambiar de vista y cerrar el drawer en móvil
  const handleViewChange = (view: 'dashboard' | 'components' | 'pages') => {
    setCurrentView(view);
    setMobileDrawerOpen(false); // Cerrar drawer al seleccionar
  };
  
  return (
    // ThemeProvider makes our theme available to all MUI components
    // Any MUI component inside ThemeProvider will use our custom theme
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline does several things:
          1. Removes default margins from <body>
          2. Applies background color from theme
          3. Sets default font from theme
          4. Ensures consistent rendering across browsers */}
      <CssBaseline />
      
      {/* AppBar - Barra de navegación superior mejorada y responsiva */}
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          {/* Menú hamburguesa en móvil */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          )}
          
          {/* Logo/Icono */}
          <IconButton edge={isMobile ? false : "start"} sx={{ mr: 2 }}>
            <SchoolIcon sx={{ color: 'primary.main' }} />
          </IconButton>
          
          {/* Título de la aplicación - más corto en móvil */}
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              color: 'text.primary',
              fontSize: { xs: '1rem', sm: '1.25rem' } // Texto más pequeño en móvil
            }}
          >
            {isMobile ? 'Latin Learning' : 'Latin Learning - Entorno de Desarrollo'}
          </Typography>
          
          {/* Botones de navegación - solo en desktop */}
          {!isMobile && (
            <>
              <Button 
                startIcon={<DashboardIcon />}
                color={currentView === 'dashboard' ? 'primary' : 'inherit'}
                variant={currentView === 'dashboard' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('dashboard')}
                sx={{ mr: 1 }}
              >
                Dashboard
              </Button>
              
              <Button 
                startIcon={<WidgetsIcon />}
                color={currentView === 'components' ? 'secondary' : 'inherit'}
                variant={currentView === 'components' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('components')}
                sx={{ mr: 1 }}
              >
                Componentes
              </Button>
              
              <Button 
                startIcon={<DashboardCustomizeIcon />}
                color={currentView === 'pages' ? 'secondary' : 'inherit'}
                variant={currentView === 'pages' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('pages')}
              >
                Páginas
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Drawer para navegación móvil */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            bgcolor: 'background.paper'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Navegación
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              selected={currentView === 'dashboard'}
              onClick={() => handleViewChange('dashboard')}
            >
              <ListItemIcon>
                <DashboardIcon color={currentView === 'dashboard' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton 
              selected={currentView === 'components'}
              onClick={() => handleViewChange('components')}
            >
              <ListItemIcon>
                <WidgetsIcon color={currentView === 'components' ? 'secondary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Componentes" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton 
              selected={currentView === 'pages'}
              onClick={() => handleViewChange('pages')}
            >
              <ListItemIcon>
                <DashboardCustomizeIcon color={currentView === 'pages' ? 'secondary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Páginas" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Contenedor principal con el contenido */}
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        width: '100%',
        overflow: 'hidden'  // Prevenir overflow horizontal
      }}>
        {/* Renderizado condicional: mostramos el componente según currentView */}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'components' && <ComponentCanvas />}
        {currentView === 'pages' && <PageCanvas />}
      </Box>
      
      {/* Later, we'll replace the Dashboard with a Router like this:
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/study" element={<StudySession />} />
              <Route path="/vocabulary" element={<VocabularyList />} />
            </Routes>
          </Router>
      */}
    </ThemeProvider>
  );
}

// Export the App component as the default export
// This means when someone imports from './App', they get this component
export default App
