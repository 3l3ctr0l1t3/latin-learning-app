/**
 * APP COMPONENT - The Root Component of our Application
 * 
 * This is the main component that wraps everything else.
 * Think of it as the <body> of your application.
 * All other components are children of this one.
 */

// Import React
import React from 'react';

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

// Import React's useState hook to manage which view we're showing
import { useState } from 'react';

// Import Box and Button from MUI for layout and navigation
import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material';

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
  // 'canvas' muestra el ComponentCanvas para desarrollo
  const [currentView, setCurrentView] = useState<'dashboard' | 'canvas'>('canvas');
  
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
      
      {/* AppBar - Barra de navegación superior */}
      {/* position="static" significa que no se queda fija al hacer scroll */}
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          {/* Título de la aplicación */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🏛️ Latin Learning App
          </Typography>
          
          {/* Botones de navegación */}
          {/* variant="outlined" si es la vista actual, "text" si no */}
          <Button 
            color={currentView === 'dashboard' ? 'primary' : 'inherit'}
            variant={currentView === 'dashboard' ? 'outlined' : 'text'}
            onClick={() => setCurrentView('dashboard')}
            sx={{ mr: 2 }} // margin-right de 16px
          >
            Dashboard
          </Button>
          
          <Button 
            color={currentView === 'canvas' ? 'secondary' : 'inherit'}
            variant={currentView === 'canvas' ? 'outlined' : 'text'}
            onClick={() => setCurrentView('canvas')}
          >
            🎨 Canvas
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Contenedor principal con el contenido */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Renderizado condicional: mostramos un componente u otro según currentView */}
        {currentView === 'dashboard' ? <Dashboard /> : <ComponentCanvas />}
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
