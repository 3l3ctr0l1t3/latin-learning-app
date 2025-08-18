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

// Import React's useState and useEffect hooks 
// useState: manages component state (which view, drawer open/closed, PWA install)
// useEffect: runs side effects like setting up event listeners
import { useState, useEffect } from 'react';

// Import Box and Button from MUI for layout and navigation
import { Box, Button, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// Import our StudySession context to manage header visibility
import { StudySessionProvider, useStudySession } from './contexts/StudySessionContext';

// Import icons for better navigation
import WidgetsIcon from '@mui/icons-material/Widgets';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';

/**
 * AppContent Component - Contenido principal de la app con header condicional
 * 
 * Este componente interno maneja la lógica del header y contenido.
 * Está separado para poder usar el hook useStudySession dentro del Provider.
 */
function AppContent() {
  // Estado para controlar qué vista mostrar
  // 'dashboard' muestra el Dashboard principal
  // 'components' muestra el ComponentCanvas para desarrollo de componentes
  // 'pages' muestra el PageCanvas para desarrollo de páginas completas
  const [currentView, setCurrentView] = useState<'dashboard' | 'components' | 'pages'>('pages');
  
  // Estado para el drawer móvil
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  /**
   * PWA (Progressive Web App) Install Button State
   * 
   * PWA es una tecnología que permite que las aplicaciones web se comporten como apps nativas.
   * Pueden instalarse en el dispositivo, funcionar offline, y enviar notificaciones push.
   * 
   * Para que una app sea instalable como PWA necesita:
   * 1. Un manifest.json con metadata de la app (nombre, iconos, colores)
   * 2. HTTPS (o localhost para desarrollo)
   * 3. Un Service Worker para funcionalidad offline
   * 
   * El navegador dispara un evento 'beforeinstallprompt' cuando detecta que la app
   * cumple los criterios para ser instalada como PWA.
   */
  
  // Estado para guardar el evento de instalación PWA
  // Este evento lo proporciona el navegador cuando la app es instalable
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  // Estado para saber si el botón de instalar debe mostrarse
  // Solo se muestra si el navegador soporta instalación PWA y no está ya instalada
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Hook para detectar el tamaño de pantalla
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true si es móvil
  
  // Hook para acceder al contexto de sesión de estudio
  const { headerVisible, isInStudySession } = useStudySession();
  
  /**
   * useEffect Hook - Configura el listener para el evento PWA
   * 
   * useEffect ejecuta código después de que el componente se renderiza.
   * Es perfecto para configurar event listeners, suscripciones, o timers.
   * 
   * El array vacío [] al final significa que este efecto solo se ejecuta una vez,
   * cuando el componente se monta (aparece en pantalla por primera vez).
   */
  useEffect(() => {
    /**
     * Handler para el evento beforeinstallprompt
     * 
     * Este evento es disparado por el navegador cuando:
     * 1. La app tiene un manifest.json válido
     * 2. Se sirve por HTTPS (o localhost)
     * 3. Tiene un service worker registrado
     * 4. El usuario ha visitado la página al menos dos veces con 5 minutos de diferencia
     *    (esto varía según el navegador)
     */
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevenir que Chrome muestre su propio prompt de instalación
      // Queremos controlar cuándo y cómo se muestra el botón de instalar
      event.preventDefault();
      
      // Guardar el evento para usarlo más tarde cuando el usuario haga click
      // Este evento tiene un método prompt() que muestra el diálogo de instalación
      setInstallPrompt(event);
      
      // Mostrar nuestro botón personalizado de instalación
      setShowInstallButton(true);
      
      // Log para debugging - ver si el evento se dispara
      console.log('PWA: App es instalable, mostrando botón de instalación');
    };
    
    // Agregar el listener al objeto window
    // window es el objeto global del navegador que representa la ventana
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    /**
     * Verificar si la app ya está instalada
     * 
     * Cuando una PWA está instalada, el navegador la abre en modo 'standalone'
     * en lugar del modo normal de navegador con barra de direcciones.
     * 
     * window.matchMedia es una API para verificar media queries de CSS
     * La query '(display-mode: standalone)' es true si la app está instalada
     */
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: App ya está instalada');
      setShowInstallButton(false);
    }
    
    /**
     * Cleanup function - Se ejecuta cuando el componente se desmonta
     * 
     * Es importante remover event listeners para evitar memory leaks
     * (fugas de memoria) cuando el componente ya no está en uso.
     */
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []); // Array vacío = solo ejecutar una vez al montar el componente
  
  /**
   * Función para manejar la instalación de la PWA
   * 
   * Esta función se ejecuta cuando el usuario hace click en el botón "Instalar App"
   * Usa el evento guardado anteriormente para mostrar el prompt nativo del navegador
   */
  const handleInstallClick = async () => {
    // Verificar que tenemos el evento de instalación guardado
    if (!installPrompt) {
      console.log('PWA: No hay prompt de instalación disponible');
      return;
    }
    
    try {
      // Mostrar el diálogo de instalación del navegador
      // prompt() es un método del evento beforeinstallprompt
      installPrompt.prompt();
      
      // Esperar a que el usuario responda al prompt
      // userChoice será un objeto con {outcome: 'accepted' | 'dismissed'}
      const { outcome } = await installPrompt.userChoice;
      
      // Log del resultado para debugging
      console.log(`PWA: Usuario respondió con: ${outcome}`);
      
      if (outcome === 'accepted') {
        // El usuario aceptó instalar la app
        console.log('PWA: App instalada exitosamente');
        
        // Ocultar el botón ya que la app fue instalada
        setShowInstallButton(false);
      }
      
      // Limpiar el prompt guardado
      // No se puede reutilizar el mismo evento, el navegador creará uno nuevo si es necesario
      setInstallPrompt(null);
      
    } catch (error) {
      // Manejar cualquier error durante la instalación
      console.error('PWA: Error al instalar la app:', error);
    }
  };
  
  // Función para cambiar de vista y cerrar el drawer en móvil
  const handleViewChange = (view: 'dashboard' | 'components' | 'pages') => {
    setCurrentView(view);
    setMobileDrawerOpen(false); // Cerrar drawer al seleccionar
  };
  
  return (
    <>
      {/* HEADER WRAPPER - Contenedor que mantiene el espacio pero puede ocultar el contenido */}
      <Box
        sx={{
          // Transiciones suaves para opacity y visibility
          transition: 'all 0.3s ease-in-out',
          // Ocultar visualmente cuando no está visible, pero mantener el espacio
          opacity: headerVisible ? 1 : 0,
          // Evitar interacciones cuando está oculto
          pointerEvents: headerVisible ? 'auto' : 'none',
          // En modo sesión, colapsar completamente el header
          height: isInStudySession ? 0 : 'auto',
          overflow: 'hidden'
        }}
      >
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
                sx={{ mr: 1 }}
              >
                Páginas
              </Button>
            </>
          )}
          
          {/**
           * PWA Install Button
           * 
           * Este botón solo aparece cuando:
           * 1. El navegador soporta instalación PWA (dispara beforeinstallprompt)
           * 2. La app no está ya instalada
           * 3. El usuario no ha rechazado la instalación previamente en esta sesión
           * 
           * El botón usa el icono InstallDesktop y colores que contrastan bien
           * con el tema oscuro para llamar la atención del usuario.
           */}
          {showInstallButton && (
            <Button
              data-testid="pwa-install-button"
              startIcon={<InstallDesktopIcon />}
              onClick={handleInstallClick}
              variant="contained"
              color="primary"
              sx={{
                // Margen izquierdo para separarlo de otros botones
                ml: { xs: 0, sm: 1 },
                // En móvil, hacerlo más pequeño para que quepa
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                // Padding adaptativo según el tamaño de pantalla
                px: { xs: 1, sm: 2 },
                // Animación suave de aparición
                animation: 'fadeIn 0.3s ease-in',
                // Definir la animación fadeIn
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 }
                },
                // Efecto hover para desktop
                '&:hover': {
                  // Escala ligeramente el botón al pasar el mouse
                  transform: 'scale(1.05)',
                  // Transición suave para el efecto hover
                  transition: 'transform 0.2s'
                }
              }}
            >
              {/* Texto en español como se requiere */}
              {isMobile ? 'Instalar' : 'Instalar App'}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      </Box>
      
      {/* Drawer para navegación móvil - Solo visible cuando el header está visible */}
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
        // Altura dinámica: pantalla completa en sesión, altura normal con header
        minHeight: isInStudySession ? '100vh' : 'calc(100vh - 64px)', 
        bgcolor: 'background.default',
        width: '100%',
        overflow: 'hidden',  // Prevenir overflow horizontal
        // Transición suave cuando cambia la altura
        transition: 'min-height 0.3s ease-in-out'
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
    </>
  );
}

/**
 * App Component - Componente raíz con todos los providers
 * 
 * This is the root of our component tree.
 * Every React app has one root component that contains all others.
 * Este componente envuelve todo con los providers necesarios.
 */
function App() {
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
      
      {/* StudySessionProvider envuelve la app para manejar el estado de sesión */}
      <StudySessionProvider>
        <AppContent />
      </StudySessionProvider>
    </ThemeProvider>
  );
}

// Export the App component as the default export
// This means when someone imports from './App', they get this component
export default App
