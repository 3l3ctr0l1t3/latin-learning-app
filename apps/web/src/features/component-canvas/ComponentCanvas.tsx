// Component Canvas - Un lienzo interactivo para mostrar y probar componentes
// Este componente sirve como área de pruebas visual donde podemos ver todos
// los componentes que estamos desarrollando en tiempo real

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider,
  Container,
  Alert,
  Button,
  Chip,
  Stack  // Ya lo teníamos importado, verificando que esté
} from '@mui/material';

// Importar el componente DurationSelector que ya creamos
import DurationSelector from '../study-session/components/DurationSelector';

// Importar el nuevo DrillTypeSelector que acabamos de crear
// Este componente permite seleccionar múltiples tipos de ejercicios
import DrillTypeSelector from '../study-session/components/DrillTypeSelector';

// Importar el WordCard que muestra información de palabras latinas
import WordCard from '../study-session/components/WordCard';
import type { LatinWord } from '../study-session/components/WordCard';

// Importar WordSearchBar para búsqueda de palabras (versión antigua)
import WordSearchBar from '../study-session/components/WordSearchBar';

// Importar WordSearchDropdown - versión mejorada con dropdown
import WordSearchDropdown from '../study-session/components/WordSearchDropdown';

// Importar SelectedWordChip para mostrar palabras seleccionadas
import SelectedWordChip from '../study-session/components/SelectedWordChip';

// Importar WordSelectionStep - componente integrado de selección
import WordSelectionStep from '../study-session/components/WordSelectionStep';

// Importar tipos necesarios (ya no necesitamos Declension y Gender aquí)

// Importar los tipos desde el archivo de tipos
// Los tipos se importan desde un archivo separado para evitar problemas de módulos
import type { DrillType, SessionDuration } from '../study-session/types';

// ComponentCanvas: Contenedor principal que muestra todos los componentes en desarrollo
// Props: ninguno - este es un componente contenedor que maneja su propio estado
const ComponentCanvas: React.FC = () => {
  // Estado para el DurationSelector - guarda la duración seleccionada en minutos
  // Usamos el tipo SessionDuration importado para mantener consistencia
  // Esto es importante para TypeScript: garantiza que solo usemos valores válidos
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(10);

  // Estado para DrillTypeSelector - ahora con el tipo correcto DrillType
  // Inicializamos con un tipo seleccionado por defecto para que el usuario vea algo
  const [selectedDrillTypes, setSelectedDrillTypes] = useState<DrillType[]>(['multipleChoice']);

  // Datos de ejemplo para WordCard - una palabra latina de muestra
  // En la aplicación real, estos datos vendrían del servicio de vocabulario
  const sampleWord: LatinWord = {
    id: 'word_rosa_0001',
    nominative: 'Rosa',
    genitive: 'rosae',
    declension: '1st',
    gender: 'feminine',
    spanishTranslation: 'rosa',
    additionalMeanings: ['flor', 'color rosa'],
    exampleSentence: 'Rosa pulchra est' // La rosa es hermosa
  };

  // Estado para demostrar la funcionalidad de selección de WordCard
  const [isWordCardSelected, setIsWordCardSelected] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);

  // Estado para WordSearchBar - el texto de búsqueda
  const [searchText, setSearchText] = useState('');
  const [searchTextWithDebounce, setSearchTextWithDebounce] = useState('');
  
  // Estado para WordSearchDropdown - palabras seleccionadas en la búsqueda
  const [selectedSearchWords, setSelectedSearchWords] = useState<LatinWord[]>([]);
  
  // Palabras de ejemplo adicionales para SelectedWordChip
  const sampleWords: LatinWord[] = [
    sampleWord, // La palabra que ya teníamos
    {
      id: 'word_dominus_0002',
      nominative: 'Dominus',
      genitive: 'domini',
      declension: '2nd',
      gender: 'masculine',
      spanishTranslation: 'señor',
      additionalMeanings: ['dueño', 'amo'],
    },
    {
      id: 'word_templum_0003',
      nominative: 'Templum',
      genitive: 'templi',
      declension: '2nd',
      gender: 'neuter',
      spanishTranslation: 'templo',
      additionalMeanings: ['santuario'],
    }
  ];
  
  // Estado para manejar palabras seleccionadas en SelectedWordChip demo
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>(['word_rosa_0001', 'word_dominus_0002']);
  
  // Estado para WordSelectionStep - componente integrado
  const [stepSelectedWords, setStepSelectedWords] = useState<LatinWord[]>([]);

  return (
    // Container: Componente MUI que centra el contenido con márgenes automáticos
    <Container maxWidth="xl">
      {/* Box principal con padding vertical responsivo */}
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Título del canvas */}
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            color: 'primary.main', // Usa el color púrpura del tema
            mb: 4, // margin-bottom de 32px
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } // Tamaño responsivo
          }}
        >
          🎨 Canvas de Componentes
        </Typography>

        {/* Mensaje informativo para el usuario */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            bgcolor: 'background.paper', // Fondo oscuro del tema
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="body1">
            Este es tu espacio de desarrollo interactivo. Aquí puedes ver y probar todos los componentes 
            que estamos construyendo para la aplicación de Latin Learning. Cada componente está aislado 
            para que puedas entender cómo funciona individualmente.
          </Typography>
        </Alert>

        {/* Grid container para organizar los componentes en columnas */}
        {/* spacing={2} en móvil para menos espacio entre elementos */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          
          {/* COMPONENTE 1: DurationSelector */}
          {/* xs={12} = ancho completo en móvil */}
          {/* sm={12} = ancho completo en tablets pequeñas */}
          {/* md={6} = mitad del ancho en tablets */}
          {/* lg={4} = un tercio en desktop */}
          <Grid item xs={12} sm={12} md={6} lg={4}>
            {/* Paper: Crea una tarjeta elevada con sombra */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, // padding responsivo: 16px móvil, 24px desktop
                height: '100%', // ocupa toda la altura disponible
                bgcolor: 'background.paper' // color de fondo del tema oscuro
              }}
            >
              {/* Encabezado del componente */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'secondary.main' }} // Color cyan del tema
              >
                ✅ DurationSelector
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Permite al usuario seleccionar la duración de la sesión de estudio.
                Los botones son mutuamente excluyentes (solo uno puede estar seleccionado).
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* El componente real */}
              <DurationSelector 
                value={selectedDuration}
                onChange={setSelectedDuration}
              />
              
              {/* Mostrar el valor actual para debugging */}
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 2, 
                  color: 'text.secondary' 
                }}
              >
                Valor actual: {selectedDuration} minutos
              </Typography>
            </Paper>
          </Grid>

          {/* COMPONENTE 2: DrillTypeSelector - COMPLETADO */}
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              {/* Encabezado del componente */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'secondary.main' }} // Color cyan para componente completado
              >
                ✅ DrillTypeSelector
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Permite seleccionar múltiples tipos de ejercicios con checkboxes.
                Cada tipo tiene su icono y descripción. Puedes seleccionar varios a la vez.
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* El componente real */}
              <DrillTypeSelector 
                value={selectedDrillTypes}
                onChange={setSelectedDrillTypes}
              />
              
              {/* Mostrar el valor actual para debugging */}
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 2, 
                  color: 'text.secondary' 
                }}
              >
                Tipos seleccionados: {selectedDrillTypes.join(', ') || 'ninguno'}
              </Typography>
            </Paper>
          </Grid>

          {/* COMPONENTE 3: WordCard - COMPLETADO */}
          <Grid item xs={12} sm={12} md={12} lg={6}> {/* Ancho completo en móvil y tablet */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              {/* Encabezado del componente */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'secondary.main' }}
              >
                ✅ WordCard
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Tarjeta que muestra información completa de una palabra latina.
                Incluye casos, género, declinación y traducción. Haz clic para seleccionar.
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Controles de demostración */}
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? 'Ocultar' : 'Mostrar'} Traducción
                </Button>
                <Chip 
                  label={isWordCardSelected ? 'Seleccionada' : 'No seleccionada'}
                  color={isWordCardSelected ? 'primary' : 'default'}
                />
              </Stack>
              
              {/* El componente WordCard */}
              <WordCard 
                word={sampleWord}
                showTranslation={showTranslation}
                selected={isWordCardSelected}
                onClick={() => setIsWordCardSelected(!isWordCardSelected)}
              />
              
              {/* Modo compacto */}
              <Typography 
                variant="subtitle2" 
                sx={{ mt: 3, mb: 1, color: 'text.secondary' }}
              >
                Versión Compacta:
              </Typography>
              <WordCard 
                word={sampleWord}
                compact={true}
                showTranslation={showTranslation}
              />
              
              {/* Modo minimalista */}
              <Typography 
                variant="subtitle2" 
                sx={{ mt: 3, mb: 1, color: 'text.secondary' }}
              >
                Versión Minimalista (sin etiquetas):
              </Typography>
              <WordCard 
                word={sampleWord}
                minimal={true}
                showTranslation={showTranslation}
                selected={isWordCardSelected}
                onClick={() => setIsWordCardSelected(!isWordCardSelected)}
              />
            </Paper>
          </Grid>

          {/* COMPONENTE 4: WordSearchDropdown - MEJORADO */}
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              {/* Encabezado del componente */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'secondary.main' }}
              >
                ✅ WordSearchDropdown
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Búsqueda con dropdown conectada al vocabulario real. 
                Incluye debouncing automático, selección múltiple y WordCards compactos.
                Busca al menos 2 caracteres para ver resultados.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* El componente WordSearchDropdown conectado a datos reales */}
              <WordSearchDropdown 
                selectedWords={selectedSearchWords}
                onSelectionChange={setSelectedSearchWords}
                maxSelection={20}
                // Usa el placeholder por defecto del componente
              />
              
              <Divider sx={{ my: 3 }} />
              
              {/* Información sobre el componente */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 1 
              }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                  Características:
                </Typography>
                <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
                  <li>Conectado a {690} palabras latinas reales</li>
                  <li>Búsqueda en nominativo, genitivo y traducción</li>
                  <li>Debouncing automático de 300ms</li>
                  <li>Dropdown con WordCards compactos</li>
                  <li>Selección múltiple sin cerrar el dropdown</li>
                  <li>Cierra con ESC o click afuera</li>
                  <li>Indicador visual de palabras seleccionadas</li>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* COMPONENTE 5: WordSelectionStep - INTEGRADO */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              {/* Encabezado del componente */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'secondary.main' }}
              >
                ✅ WordSelectionStep (Componente Integrado)
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Componente completo para selección de palabras. Integra búsqueda, visualización de selección,
                progreso, y acciones rápidas en una sola interfaz. Ideal para páginas completas.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* El componente WordSelectionStep */}
              <WordSelectionStep
                selectedWords={stepSelectedWords}
                onSelectionChange={setStepSelectedWords}
                minWords={5}
                maxWords={30}
              />
              
              {/* Información sobre el componente */}
              <Box sx={{ 
                mt: 3,
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 1 
              }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                  Características del componente integrado:
                </Typography>
                <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
                  <li>Búsqueda con dropdown integrada</li>
                  <li>Visualización de progreso con barra</li>
                  <li>Validación de mínimos y máximos</li>
                  <li>Acciones rápidas (selección aleatoria, por declinación)</li>
                  <li>Sugerencias temáticas</li>
                  <li>Estado completo en un solo componente</li>
                  <li>Ideal para usar en páginas de configuración</li>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* COMPONENTE 6: SelectedWordChip - COMPLETADO */}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              {/* Encabezado del componente */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'secondary.main' }}
              >
                ✅ SelectedWordChip
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Chips para mostrar palabras seleccionadas. Incluye tooltip con información,
                botón de eliminar, y colores por declinación. Tres variantes disponibles.
                Colores: 1ª púrpura, 2ª azul, 3ª verde, 4ª naranja, 5ª rojo.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Variante Default */}
              <Typography 
                variant="subtitle2" 
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Variante Default (con enunciación):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                {sampleWords.map(word => (
                  <SelectedWordChip
                    key={word.id}
                    word={word}
                    onDelete={(id) => {
                      console.log('Eliminar palabra:', id);
                    }}
                    onClick={(w) => {
                      console.log('Click en palabra:', w.nominative);
                    }}
                    variant="default"
                  />
                ))}
              </Stack>
              
              {/* Variante Compact */}
              <Typography 
                variant="subtitle2" 
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Variante Compacta (solo nominativo):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                {sampleWords.map(word => (
                  <SelectedWordChip
                    key={word.id}
                    word={word}
                    onDelete={(id) => {
                      console.log('Eliminar palabra:', id);
                    }}
                    variant="compact"
                  />
                ))}
              </Stack>
              
              {/* Variante Detailed */}
              <Typography 
                variant="subtitle2" 
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Variante Detallada (con abreviación de género):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                {sampleWords.map(word => (
                  <SelectedWordChip
                    key={word.id}
                    word={word}
                    onDelete={(id) => {
                      console.log('Eliminar palabra:', id);
                    }}
                    variant="detailed"
                  />
                ))}
              </Stack>
              
              {/* Sin colores por declinación */}
              <Typography 
                variant="subtitle2" 
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Sin colores por declinación (monocromático):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                {sampleWords.map(word => (
                  <SelectedWordChip
                    key={word.id}
                    word={word}
                    onDelete={(id) => {
                      console.log('Eliminar palabra:', id);
                    }}
                    colorByDeclension={false}
                  />
                ))}
              </Stack>
              
              {/* Estado deshabilitado */}
              <Typography 
                variant="subtitle2" 
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Estado Deshabilitado:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                <SelectedWordChip
                  word={sampleWords[0]}
                  disabled={true}
                />
              </Stack>
            </Paper>
          </Grid>

        </Grid>

        {/* Sección de estadísticas del desarrollo */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            📊 Progreso del Desarrollo
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: 'success.dark', textAlign: 'center' }}>
                <Typography variant="h4">6</Typography>
                <Typography variant="body2">Componentes Completados</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: 'warning.dark', textAlign: 'center' }}>
                <Typography variant="h4">0</Typography>
                <Typography variant="body2">En Progreso</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
                <Typography variant="h4">0</Typography>
                <Typography variant="body2">Pendientes</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Instrucciones para el usuario */}
        <Alert 
          severity="success" 
          sx={{ 
            mt: 4,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="body2">
            <strong>💡 Cómo usar este canvas:</strong><br />
            1. Cada tarjeta representa un componente<br />
            2. Los componentes con ✅ están listos y puedes interactuar con ellos<br />
            3. Los componentes con ⬜ están pendientes de desarrollo<br />
            4. Observa cómo cada componente es independiente y reutilizable<br />
            5. Los valores que cambias se muestran en tiempo real
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

// Exportar el componente para poder usarlo en otros lugares
export default ComponentCanvas;