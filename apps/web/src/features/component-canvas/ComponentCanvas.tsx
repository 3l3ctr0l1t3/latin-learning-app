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
  // Alert, // Removed - not being used
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
// import WordSearchBar from '../study-session/components/WordSearchBar'; // Removed - not being used

// Importar WordSearchDropdown - versión mejorada con dropdown
import WordSearchDropdown from '../study-session/components/WordSearchDropdown';

// Importar SelectedWordChip para mostrar palabras seleccionadas
import SelectedWordChip from '../study-session/components/SelectedWordChip';

// Importar WordSelectionStep - componente integrado de selección
import WordSelectionStep from '../study-session/components/WordSelectionStep';

// Importar componentes de ejercicios
import MultipleChoiceOption from '../study-session/components/exercises/MultipleChoiceOption';
import MultipleChoiceDrillCard from '../study-session/components/exercises/MultipleChoiceDrillCard';
import MultipleChoiceDeclensionCard from '../study-session/components/exercises/MultipleChoiceDeclensionCard';

// Importar componentes de navegación y estudio
import StudyWordsViewer from '../study-session/components/StudyWordsViewer';
import StudySession from '../study-session/components/StudySession';
import SessionTimer from '../study-session/components/SessionTimer';
import DrillSessionComponent from '../study-session/components/DrillSessionComponent';

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
  // const [searchText, setSearchText] = useState(''); // Removed - not being used
  // const [searchTextWithDebounce, setSearchTextWithDebounce] = useState(''); // Removed - not being used
  
  // Estado para WordSearchDropdown - palabras seleccionadas en la búsqueda
  const [selectedSearchWords, setSelectedSearchWords] = useState<LatinWord[]>([]);
  
  // Palabras de ejemplo adicionales para SelectedWordChip y ejercicios
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
    },
    {
      id: 'word_aqua_0004',
      nominative: 'Aqua',
      genitive: 'aquae',
      declension: '1st',
      gender: 'feminine',
      spanishTranslation: 'agua',
      additionalMeanings: ['líquido'],
    },
    {
      id: 'word_liber_0005',
      nominative: 'Liber',
      genitive: 'libri',
      declension: '2nd',
      gender: 'masculine',
      spanishTranslation: 'libro',
      additionalMeanings: ['obra', 'texto'],
    },
    {
      id: 'word_mensa_0006',
      nominative: 'Mensa',
      genitive: 'mensae',
      declension: '1st',
      gender: 'feminine',
      spanishTranslation: 'mesa',
      additionalMeanings: ['tabla'],
    },
    {
      id: 'word_rex_0007',
      nominative: 'Rex',
      genitive: 'regis',
      declension: '3rd',
      gender: 'masculine',
      spanishTranslation: 'rey',
      additionalMeanings: ['monarca', 'soberano'],
    },
    {
      id: 'word_dies_0008',
      nominative: 'Dies',
      genitive: 'diei',
      declension: '5th',
      gender: 'masculine',
      spanishTranslation: 'día',
      additionalMeanings: ['jornada', 'fecha'],
    },
    {
      id: 'word_manus_0009',
      nominative: 'Manus',
      genitive: 'manus',
      declension: '4th',
      gender: 'feminine',
      spanishTranslation: 'mano',
      additionalMeanings: ['poder', 'fuerza'],
    }
  ];
  
  // Estado para manejar palabras seleccionadas en SelectedWordChip demo
  // const [selectedWordIds, setSelectedWordIds] = useState<string[]>(['word_rosa_0001', 'word_dominus_0002']); // Removed - not being used
  
  // Estado para WordSelectionStep - componente integrado
  const [stepSelectedWords, setStepSelectedWords] = useState<LatinWord[]>([]);

  return (
    // Container: Componente MUI que centra el contenido con márgenes automáticos
    <Container maxWidth="xl">
      {/* Box principal con padding vertical responsivo */}
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>

        {/* Grid container para organizar los componentes en columnas */}
        {/* spacing={2} en móvil para menos espacio entre elementos */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          
          {/* COMPONENTE NUEVO: DrillSessionComponent - Sesión completa de ejercicios */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                🆕 DrillSessionComponent
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Orquestador de sesión de ejercicios. Genera drills aleatorios, maneja navegación,
                tracking de respuestas y control de tiempo. Este componente maneja toda la lógica
                de la sesión de práctica.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ 
                height: 500,
                overflow: 'auto',  // Agregar scroll si el contenido es muy grande
                position: 'relative'  // Para contener el contenido
              }}>
                <DrillSessionComponent
                  selectedWords={sampleWords}
                  drillTypes={['multipleChoice', 'multipleChoiceDeclension']}
                  sessionDurationMinutes={5}
                  onSessionEnd={(results) => {
                    console.log('Sesión terminada. Resultados:', results);
                  }}
                  onProgress={(completed, total) => {
                    console.log(`Progreso: ${completed}/${total}`);
                  }}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* COMPONENTE NUEVO: MultipleChoiceDeclension - Ejercicio de declinación (Primera instancia) */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                🆕 MultipleChoiceDeclension - Ejercicio de Declinación
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Ejercicio para identificar la declinación de una palabra latina.
                Muestra la palabra y su genitivo, el usuario debe elegir entre las 5 declinaciones.
                Incluye colores distintivos y explicación educativa.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                overflow: 'auto',
                p: 2
              }}>
                <MultipleChoiceDeclensionCard
                  currentWord={sampleWords[6]} // Rex, regis - 3ª declinación
                  onAnswer={(isCorrect) => {
                    console.log(`Respuesta declinación: ${isCorrect ? 'Correcta' : 'Incorrecta'}`);
                  }}
                  showLabels={true}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* COMPONENTE: MultipleChoiceDeclension - Segunda instancia con palabra diferente */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                MultipleChoiceDeclension - Ejemplo 2
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Otro ejemplo con una palabra de la 5ª declinación.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ 
                overflow: 'auto',
                p: 1
              }}>
                <MultipleChoiceDeclensionCard
                  currentWord={sampleWords[7]} // Dies, diei - 5ª declinación
                  onAnswer={(isCorrect) => {
                    console.log(`Respuesta declinación: ${isCorrect ? 'Correcta' : 'Incorrecta'}`);
                  }}
                  showLabels={true}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* COMPONENTE: MultipleChoiceDeclension - Tercera instancia */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                MultipleChoiceDeclension - Ejemplo 3
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Ejemplo con una palabra de la 4ª declinación.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ 
                overflow: 'auto',
                p: 1
              }}>
                <MultipleChoiceDeclensionCard
                  currentWord={sampleWords[8]} // Manus, manus - 4ª declinación
                  onAnswer={(isCorrect) => {
                    console.log(`Respuesta declinación: ${isCorrect ? 'Correcta' : 'Incorrecta'}`);
                  }}
                  showLabels={true}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* COMPONENTE DE EJERCICIO: MultipleChoiceDrillCard (Latin → Spanish) */}
          <Grid item xs={12} md={6}>
            <MultipleChoiceDrillCard
              currentWord={sampleWord}
              allWords={sampleWords}
              questionType="latinToSpanish"
              onAnswer={(isCorrect) => console.log('Respuesta Latin→Spanish:', isCorrect ? 'Correcta' : 'Incorrecta')}
              numberOfOptions={4}
              showLabels={true}
            />
          </Grid>
          
          {/* COMPONENTE DE EJERCICIO: MultipleChoiceDrillCard (Spanish → Latin) */}
          <Grid item xs={12} md={6}>
            <MultipleChoiceDrillCard
              currentWord={sampleWords[1]}  // Usar una palabra diferente para variedad
              allWords={sampleWords}
              questionType="spanishToLatin"
              onAnswer={(isCorrect) => console.log('Respuesta Spanish→Latin:', isCorrect ? 'Correcta' : 'Incorrecta')}
              numberOfOptions={4}
              showLabels={true}
            />
          </Grid>
          
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
                sx={{ 
                  color: 'text.primary',  // Texto blanco principal
                  fontWeight: 'medium'
                }}
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
              
              <Divider sx={{ mb: 2 }} data-testid="component-canvas-duration-selector-divider" />
              
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }} // Color cyan para componente completado
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
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

          {/* COMPONENTE 7: MultipleChoiceOption - Opción de ejercicio */}
          <Grid item xs={12} md={6}>
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                🆕 MultipleChoiceOption
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Opción individual para ejercicios de selección múltiple.
                Muestra diferentes estados según la interacción.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Estados del componente */}
              <Stack spacing={2}>
                {/* Estado normal */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Estado Normal (no seleccionada):
                </Typography>
                <MultipleChoiceOption
                  id="option1"
                  text="Rosa, la rosa"
                  isSelected={false}
                  isCorrect={false}
                  isAnswered={false}
                  onSelect={(id) => console.log('Seleccionada:', id)}
                />
                
                {/* Estado seleccionada */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Seleccionada (antes de responder):
                </Typography>
                <MultipleChoiceOption
                  id="option2"
                  text="Aqua, el agua"
                  isSelected={true}
                  isCorrect={false}
                  isAnswered={false}
                  onSelect={(id) => console.log('Seleccionada:', id)}
                />
                
                {/* Respuesta correcta */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Respuesta Correcta (después de responder):
                </Typography>
                <MultipleChoiceOption
                  id="option3"
                  text="Mensa, la mesa"
                  isSelected={true}
                  isCorrect={true}
                  isAnswered={true}
                  onSelect={(id) => console.log('Seleccionada:', id)}
                />
                
                {/* Respuesta incorrecta */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Respuesta Incorrecta (después de responder):
                </Typography>
                <MultipleChoiceOption
                  id="option4"
                  text="Terra, la tierra"
                  isSelected={true}
                  isCorrect={false}
                  isAnswered={true}
                  onSelect={(id) => console.log('Seleccionada:', id)}
                />
                
                {/* Opción correcta no seleccionada */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Correcta pero no seleccionada (después de responder):
                </Typography>
                <MultipleChoiceOption
                  id="option5"
                  text="Stella, la estrella"
                  isSelected={false}
                  isCorrect={true}
                  isAnswered={true}
                  onSelect={(id) => console.log('Seleccionada:', id)}
                />
                
                {/* Estado deshabilitado */}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Deshabilitada:
                </Typography>
                <MultipleChoiceOption
                  id="option6"
                  text="Luna, la luna"
                  isSelected={false}
                  isCorrect={false}
                  isAnswered={false}
                  isDisabled={true}
                  onSelect={(id) => console.log('Seleccionada:', id)}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* COMPONENTE 8: StudyWordsViewer - Visor de palabras para estudiar */}
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
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                🆕 StudyWordsViewer
              </Typography>
              
              {/* Descripción del componente */}
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Visor de palabras para la fase de estudio. Permite navegar entre palabras
                seleccionadas y continuar a ejercicios en cualquier momento.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* El componente StudyWordsViewer con palabras de ejemplo */}
              <Box sx={{ height: 600 }}>
                <StudyWordsViewer
                  words={sampleWords}
                  onContinueToExercises={() => {
                    console.log('Continuar a ejercicios');
                  }}
                  showTranslation={true}
                />
              </Box>
            </Paper>
          </Grid>

          {/* COMPONENTE 9: SessionTimer - Timer de sesión */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                🆕 SessionTimer
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Timer que muestra el progreso de la sesión con barra visual y colores.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Timer de 5 minutos:
                </Typography>
                <SessionTimer
                  totalMinutes={5}
                  onTimeUp={() => console.log('¡Tiempo terminado!')}
                  isPaused={false}
                />
                
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Timer pausado:
                </Typography>
                <SessionTimer
                  totalMinutes={10}
                  onTimeUp={() => console.log('¡Tiempo terminado!')}
                  isPaused={true}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* COMPONENTE 10: StudySession - Sesión completa */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: 'text.primary', fontWeight: 'medium' }}
              >
                🆕 StudySession
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Sesión de estudio completa con timer. Comienza con revisión de palabras,
                luego ejercicios, y finaliza con resumen.
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ height: 700 }}>
                <StudySession
                  selectedWords={sampleWords}
                  duration={5}
                  drillTypes={['multipleChoice', 'fillInBlank']}
                  onEndSession={() => console.log('Sesión finalizada')}
                />
              </Box>
            </Paper>
          </Grid>

        </Grid>

      </Box>
    </Container>
  );
};

// Exportar el componente para poder usarlo en otros lugares
export default ComponentCanvas;