/**
 * PAGE CANVAS - Lienzo para probar páginas completas
 * 
 * A diferencia del ComponentCanvas que muestra componentes individuales,
 * este canvas muestra páginas completas con múltiples componentes trabajando
 * juntos para formar flujos de usuario reales.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Composición de páginas: Cómo los componentes trabajan juntos
 * - Flujo de datos: Cómo pasa la información entre componentes
 * - Layout y estructura: Cómo organizar componentes en una página
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Tabs,
  Tab,
  Divider,
  Button,
  IconButton,
  Stack,
  Chip
} from '@mui/material';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

// Importar nuestros componentes
import DurationSelector from '../study-session/components/DurationSelector';
import DrillTypeSelector from '../study-session/components/DrillTypeSelector';
import WordSearchDropdown from '../study-session/components/WordSearchDropdown';
import WordCard from '../study-session/components/WordCard';
import SelectedWordChip from '../study-session/components/SelectedWordChip';
import WordSelectionStep from '../study-session/components/WordSelectionStep';

// Importar tipos
import type { DrillType, SessionDuration } from '../study-session/types';
import type { LatinWord } from '../study-session/components/WordCard';

/**
 * INTERFAZ PARA MANEJAR PESTAÑAS
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * COMPONENTE TAB PANEL
 * Muestra el contenido de una pestaña solo cuando está activa
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

/**
 * PÁGINA DE CONFIGURACIÓN DE SESIÓN DE ESTUDIO
 * 
 * Esta página permite al usuario configurar una sesión de estudio:
 * 1. Seleccionar palabras para estudiar
 * 2. Elegir la duración de la sesión
 * 3. Seleccionar tipos de ejercicios
 * 4. Revisar y comenzar la sesión
 */
const StudySessionConfigPage: React.FC = () => {
  // Estados para la configuración de la sesión
  const [selectedWords, setSelectedWords] = useState<LatinWord[]>([]);
  const [duration, setDuration] = useState<SessionDuration>(10);
  const [drillTypes, setDrillTypes] = useState<DrillType[]>(['multipleChoice']);
  const [currentStep, setCurrentStep] = useState(0); // Para navegación por pasos

  // Pasos de configuración
  const steps = [
    'Seleccionar Palabras',
    'Duración y Ejercicios',
    'Revisar y Comenzar'
  ];

  /**
   * MANEJADOR PARA AVANZAR AL SIGUIENTE PASO
   */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * MANEJADOR PARA RETROCEDER AL PASO ANTERIOR
   */
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * VALIDACIÓN: ¿Puede avanzar al siguiente paso?
   */
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedWords.length >= 5; // Mínimo 5 palabras
      case 1:
        return drillTypes.length > 0; // Al menos un tipo de ejercicio
      default:
        return true;
    }
  };

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, // padding responsivo
      minHeight: { xs: '400px', sm: '600px' } // altura mínima responsiva
    }}>
      {/* ENCABEZADO DE LA PÁGINA */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: 'primary.main',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } // Tamaño responsivo
          }}
        >
          Configurar Sesión de Estudio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configura tu sesión de práctica de latín paso a paso
        </Typography>
      </Box>

      {/* INDICADOR DE PROGRESO */}
      <Box sx={{ mb: 3, overflowX: 'auto' }}>
        <Stack 
          direction="row" 
          spacing={{ xs: 1, sm: 2 }} 
          alignItems="center"
          sx={{ minWidth: 'fit-content' }}>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <Chip
                label={`${index + 1}. ${step}`}
                color={index === currentStep ? 'primary' : 'default'}
                variant={index === currentStep ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: index === currentStep ? 'bold' : 'normal',
                  opacity: index > currentStep ? 0.5 : 1
                }}
              />
              {index < steps.length - 1 && (
                <ArrowForwardIcon 
                  sx={{ 
                    color: index < currentStep ? 'primary.main' : 'text.disabled',
                    fontSize: '1rem'
                  }} 
                />
              )}
            </React.Fragment>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* CONTENIDO DE CADA PASO */}
      <Box sx={{ minHeight: '300px' }}>
        {/* PASO 1: SELECCIONAR PALABRAS - Usando el nuevo componente integrado */}
        {currentStep === 0 && (
          <WordSelectionStep
            selectedWords={selectedWords}
            onSelectionChange={setSelectedWords}
            minWords={5}
            maxWords={30}
          />
        )}

        {/* PASO 2: DURACIÓN Y EJERCICIOS */}
        {currentStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              Paso 2: Configura la duración y tipos de ejercicios
            </Typography>
            
            {/* Selector de duración */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Duración de la sesión
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ¿Cuánto tiempo quieres practicar?
              </Typography>
              <DurationSelector
                value={duration}
                onChange={setDuration}
              />
            </Box>
            
            {/* Selector de tipos de ejercicios */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tipos de ejercicios
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecciona los tipos de práctica que prefieras
              </Typography>
              <DrillTypeSelector
                value={drillTypes}
                onChange={setDrillTypes}
              />
            </Box>
          </Box>
        )}

        {/* PASO 3: REVISAR Y COMENZAR */}
        {currentStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              Paso 3: Revisa tu configuración
            </Typography>
            
            {/* Resumen de configuración */}
            <Stack spacing={3}>
              {/* Palabras seleccionadas */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Palabras seleccionadas ({selectedWords.length})
                </Typography>
                <Box sx={{ 
                  p: { xs: 1, sm: 2 },  // Padding responsivo
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  maxHeight: { xs: 150, sm: 200 },  // Altura responsiva
                  overflow: 'auto'
                }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedWords.map(word => (
                      <SelectedWordChip
                        key={word.id}
                        word={word}
                        variant="compact"
                        showTooltip={true}
                        colorByDeclension={true}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
              
              {/* Duración */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Duración de la sesión
                </Typography>
                <Chip 
                  label={`${duration} minutos`}
                  color="primary"
                  size="large"
                />
              </Box>
              
              {/* Tipos de ejercicios */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Tipos de ejercicios
                </Typography>
                <Stack direction="row" spacing={1}>
                  {drillTypes.map(type => (
                    <Chip
                      key={type}
                      label={
                        type === 'multipleChoice' ? 'Opción Múltiple' :
                        type === 'fillInBlank' ? 'Completar Espacios' :
                        type === 'directInput' ? 'Entrada Directa' :
                        type === 'flashcards' ? 'Tarjetas' : type
                      }
                      color="secondary"
                    />
                  ))}
                </Stack>
              </Box>
              
              {/* Botón para comenzar */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => {
                  console.log('Comenzar sesión con:', {
                    words: selectedWords,
                    duration,
                    drillTypes
                  });
                }}
              >
                🚀 Comenzar Sesión de Estudio
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      {/* NAVEGACIÓN ENTRE PASOS */}
      <Box sx={{ 
        mt: 4, 
        pt: 3, 
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex', 
        justifyContent: 'space-between' 
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        
        <Button
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 || !canProceed()}
        >
          Siguiente
        </Button>
      </Box>
    </Paper>
  );
};

/**
 * PAGE CANVAS PRINCIPAL
 * 
 * Contenedor que muestra diferentes páginas para probar
 */
const PageCanvas: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* TÍTULO */}
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            color: 'primary.main',
            mb: 4,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } // Tamaño responsivo
          }}
        >
          📄 Canvas de Páginas
        </Typography>

        {/* DESCRIPCIÓN */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="body1">
            Este es el Canvas de Páginas donde probamos páginas completas con múltiples componentes 
            trabajando juntos. A diferencia del Canvas de Componentes que muestra piezas individuales, 
            aquí vemos flujos completos de usuario.
          </Typography>
        </Alert>

        {/* TABS PARA DIFERENTES PÁGINAS */}
        <Paper sx={{ width: '100%' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="scrollable"  // Permite scroll en móvil
            scrollButtons="auto"  // Muestra botones de scroll cuando es necesario
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Configuración de Sesión" />
            <Tab label="Sesión Activa (Próximamente)" disabled />
            <Tab label="Resultados (Próximamente)" disabled />
            <Tab label="Perfil (Próximamente)" disabled />
          </Tabs>

          {/* CONTENIDO DE CADA TAB */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>  {/* Padding responsivo */}
            <TabPanel value={currentTab} index={0}>
              <StudySessionConfigPage />
            </TabPanel>
            
            <TabPanel value={currentTab} index={1}>
              <Alert severity="warning">
                Página de Sesión Activa - En desarrollo
              </Alert>
            </TabPanel>
            
            <TabPanel value={currentTab} index={2}>
              <Alert severity="warning">
                Página de Resultados - En desarrollo
              </Alert>
            </TabPanel>
            
            <TabPanel value={currentTab} index={3}>
              <Alert severity="warning">
                Página de Perfil - En desarrollo
              </Alert>
            </TabPanel>
          </Box>
        </Paper>

        {/* INFORMACIÓN DE DESARROLLO */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            📊 Estado del Desarrollo
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, bgcolor: 'success.dark', flex: 1, textAlign: 'center' }}>
              <Typography variant="h4">1</Typography>
              <Typography variant="body2">Páginas Completas</Typography>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: 'warning.dark', flex: 1, textAlign: 'center' }}>
              <Typography variant="h4">3</Typography>
              <Typography variant="body2">En Desarrollo</Typography>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

// Exportar el componente
export default PageCanvas;