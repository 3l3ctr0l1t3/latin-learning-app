/**
 * HOMEPAGE COMPONENT
 * 
 * Página principal de la aplicación de aprendizaje de latín.
 * Muestra:
 * - Bienvenida al usuario
 * - Explicación del sistema de colores por declinación
 * - Botón para iniciar sesión de estudio
 * - Estadísticas básicas (futuro)
 * 
 * CONCEPTOS IMPORTANTES:
 * - Page Component: Componente de nivel página en un SPA
 * - Landing Page: Primera vista que ve el usuario
 * - Call to Action: Botón prominente para acción principal
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
// Iconos
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
// Componente reutilizable de guía de colores
import DeclensionColorGuide from '../../components/global/DeclensionColorGuide';

/**
 * PROPS DEL COMPONENTE
 */
interface HomepageProps {
  onStartSession: () => void;  // Callback cuando el usuario quiere iniciar sesión
}

/**
 * HOMEPAGE COMPONENT
 * 
 * Página de inicio con información y acceso rápido a sesión de estudio
 */
const Homepage: React.FC<HomepageProps> = ({ onStartSession }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
        {/* HEADER - Bienvenida */}
        <Fade in timeout={500}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            {/* Icono principal */}
            <AutoStoriesIcon 
              sx={{ 
                fontSize: { xs: 60, md: 80 },
                color: 'primary.main',
                mb: 2
              }}
            />
            
            {/* Título principal */}
            <Typography 
              variant={isLgUp ? 'h2' : isMdUp ? 'h3' : 'h4'}
              sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2
              }}
            >
              Aprende Latín
            </Typography>
            
            {/* Subtítulo */}
            <Typography 
              variant={isMdUp ? 'h6' : 'body1'}
              sx={{ 
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Domina el vocabulario latino con ejercicios interactivos y 
              un sistema visual que te ayuda a recordar cada palabra
            </Typography>
          </Box>
        </Fade>
        
        {/* BOTÓN PRINCIPAL DE ACCIÓN */}
        <Fade in timeout={700}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: { xs: 4, md: 6 }
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={onStartSession}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
              data-testid="button-start-session"
            >
              Comenzar Sesión de Estudio
            </Button>
          </Box>
        </Fade>
        
        {/* SECCIÓN: Sistema de Colores - Usando componente reutilizable */}
        <Fade in timeout={900}>
          <Box sx={{ mb: 4 }}>
            <DeclensionColorGuide 
              // Usar configuración por defecto, que incluye título y descripción
              showTip={true}
              elevation={2}
            />
          </Box>
        </Fade>
        
        {/* SECCIÓN: Características */}
        <Fade in timeout={1100}>
          <Grid container spacing={3}>
            {/* Tarjeta 1: Vocabulario */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <SchoolIcon 
                  sx={{ 
                    fontSize: 48,
                    color: 'primary.main',
                    mb: 2
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  690+ Palabras
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vocabulario completo organizado por declinación, 
                  género y categoría gramatical
                </Typography>
              </Paper>
            </Grid>
            
            {/* Tarjeta 2: Ejercicios */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <PlayArrowIcon 
                  sx={{ 
                    fontSize: 48,
                    color: 'secondary.main',
                    mb: 2
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Ejercicios Interactivos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Múltiple opción, escritura, identificación de 
                  declinación y más tipos de práctica
                </Typography>
              </Paper>
            </Grid>
            
            {/* Tarjeta 3: Progreso */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <AutoStoriesIcon 
                  sx={{ 
                    fontSize: 48,
                    color: 'success.main',
                    mb: 2
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Aprendizaje Adaptativo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sistema que se adapta a tu ritmo y refuerza 
                  las áreas que necesitas mejorar
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
        
        {/* BOTÓN SECUNDARIO DE ACCIÓN */}
        <Fade in timeout={1300}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: { xs: 4, md: 6 }
          }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<SchoolIcon />}
              onClick={onStartSession}
              sx={{
                px: { xs: 3, md: 4 },
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Practicar Vocabulario
            </Button>
          </Box>
        </Fade>
      </Box>
    </Container>
  );
};

export default Homepage;