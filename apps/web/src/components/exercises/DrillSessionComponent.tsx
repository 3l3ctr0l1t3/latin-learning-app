/**
 * DRILL SESSION COMPONENT
 * 
 * Componente orquestador que maneja toda la sesión de ejercicios.
 * Es responsable de:
 * - Generar ejercicios aleatorios
 * - Manejar la navegación entre ejercicios
 * - Tracking de respuestas y estadísticas
 * - Control del tiempo de sesión
 * 
 * CONCEPTOS IMPORTANTES:
 * - Session Manager Pattern: Un componente que orquesta otros
 * - State Management: Maneja el estado global de la sesión
 * - Randomization: Genera ejercicios aleatorios
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Fade,
  Button
} from '@mui/material';
import MultipleChoiceDrillCard from './MultipleChoiceDrillCard';
import MultipleChoiceDeclensionCard from './MultipleChoiceDeclensionCard';
import TypeLatinWordDrillCard from './TypeLatinWordDrillCard';
import type { LatinWord } from '../global/WordCard';
// Definimos QuestionType aquí ya que es usado por el componente
export type QuestionType = 'latinToSpanish' | 'spanishToLatin' | 'gender' | 'declension';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SkipNextIcon from '@mui/icons-material/SkipNext';

/**
 * TIPOS DE DRILL DISPONIBLES
 */
export type DrillType = 'multipleChoice' | 'multipleChoiceDeclension' | 'typeLatinWord';

/**
 * CONFIGURACIÓN DE UN DRILL INDIVIDUAL
 */
interface DrillConfig {
  id: string;                          // ID único del ejercicio
  type: DrillType;                     // Tipo de ejercicio
  word: LatinWord;                     // Palabra para el ejercicio
  questionType?: QuestionType;         // Para multiple choice
  timestamp: number;                   // Cuándo se generó
}

/**
 * RESULTADO DE UN DRILL
 */
interface DrillResult {
  drillId: string;                     // ID del ejercicio
  word: LatinWord;                     // Palabra del ejercicio
  type: DrillType;                     // Tipo de ejercicio
  isCorrect: boolean;                  // Si fue correcto
  timeSpent: number;                   // Tiempo en segundos
  timestamp: number;                   // Cuándo se respondió
  wasSkipped?: boolean;                // Si el ejercicio fue saltado (sin responder)
}

/**
 * PROPS DEL DRILL SESSION COMPONENT
 */
interface DrillSessionComponentProps {
  // Configuración de la sesión
  selectedWords: LatinWord[];          // Palabras seleccionadas
  drillTypes: DrillType[];             // Tipos de ejercicios habilitados
  sessionDurationMinutes: number;      // Duración en minutos
  
  // Callbacks
  onSessionEnd?: (results: DrillResult[]) => void;  // Al terminar la sesión
  onProgress?: (completed: number, total: number) => void;  // Progreso
  onDrillComplete?: (results: DrillResult[]) => void;  // Actualización de resultados en tiempo real
}

/**
 * DRILL SESSION COMPONENT
 * 
 * Orquesta toda la sesión de ejercicios, generando drills aleatorios
 * y manejando la navegación entre ellos.
 */
const DrillSessionComponent: React.FC<DrillSessionComponentProps> = ({
  selectedWords,
  drillTypes,
  sessionDurationMinutes,
  onSessionEnd,
  onProgress,
  onDrillComplete
}) => {
  // Estado de la sesión
  const [currentDrill, setCurrentDrill] = useState<DrillConfig | null>(null);
  const [drillQueue, setDrillQueue] = useState<DrillConfig[]>([]);
  const [completedDrills, setCompletedDrills] = useState<DrillResult[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(sessionDurationMinutes * 60); // en segundos
  
  // Estado del drill actual
  const [currentDrillStartTime, setCurrentDrillStartTime] = useState<number>(Date.now());
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // Referencias
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * GENERAR UN DRILL ALEATORIO
   */
  const generateRandomDrill = useCallback((): DrillConfig => {
    // Seleccionar palabra aleatoria
    const randomWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];
    
    // Seleccionar tipo de drill aleatorio
    const randomDrillType = drillTypes[Math.floor(Math.random() * drillTypes.length)];
    
    // Para multiple choice, seleccionar tipo de pregunta aleatorio
    // Solo incluimos latinToSpanish y spanishToLatin para traducción
    // 'gender' y 'declension' son para otros tipos de ejercicios
    const questionTypes: QuestionType[] = ['latinToSpanish', 'spanishToLatin'];
    const randomQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    return {
      id: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: randomDrillType,
      word: randomWord,
      questionType: randomDrillType === 'multipleChoice' ? randomQuestionType : undefined,
      timestamp: Date.now()
    };
  }, [selectedWords, drillTypes]);
  
  /**
   * GENERAR COLA INICIAL DE DRILLS
   */
  const generateInitialQueue = useCallback(() => {
    const queue: DrillConfig[] = [];
    // Generar 5 drills iniciales
    for (let i = 0; i < 5; i++) {
      queue.push(generateRandomDrill());
    }
    return queue;
  }, [generateRandomDrill]);
  
  /**
   * MANEJAR RESPUESTA DEL DRILL
   */
  const handleDrillAnswer = (correct: boolean) => {
    setHasAnswered(true);
    
    // Registrar resultado
    if (currentDrill) {
      const timeSpent = Math.floor((Date.now() - currentDrillStartTime) / 1000);
      const result: DrillResult = {
        drillId: currentDrill.id,
        word: currentDrill.word,
        type: currentDrill.type,
        isCorrect: correct,
        timeSpent,
        timestamp: Date.now()
      };
      
      // Actualizar los drills completados inmediatamente
      const updatedDrills = [...completedDrills, result];
      setCompletedDrills(updatedDrills);
      
      // Notificar progreso
      if (onProgress) {
        onProgress(updatedDrills.length, updatedDrills.length + drillQueue.length);
      }
      
      // Notificar el resultado inmediatamente a StudySession para actualizar los contadores
      if (onDrillComplete) {
        onDrillComplete(updatedDrills);
      }
    }
  };
  
  /**
   * IR AL SIGUIENTE DRILL
   */
  const goToNextDrill = () => {
    if (drillQueue.length > 0) {
      // Tomar el siguiente de la cola
      const [nextDrill, ...remainingQueue] = drillQueue;
      setCurrentDrill(nextDrill);
      setDrillQueue(remainingQueue);
      
      // Agregar un nuevo drill a la cola
      setDrillQueue(prev => [...prev, generateRandomDrill()]);
      
      // Resetear estado
      setHasAnswered(false);
      setCurrentDrillStartTime(Date.now());
    } else {
      // No hay más drills, terminar sesión
      endSession();
    }
  };
  
  /**
   * SALTAR DRILL (sin responder)
   */
  const skipDrill = () => {
    if (currentDrill) {
      // Registrar como ejercicio saltado (no como incorrecto)
      // wasSkipped = true indica que el usuario no intentó responder
      const result: DrillResult = {
        drillId: currentDrill.id,
        word: currentDrill.word,
        type: currentDrill.type,
        isCorrect: false,      // Técnicamente no es correcto, pero tampoco es un error
        timeSpent: 0,          // No se gastó tiempo intentando resolverlo
        timestamp: Date.now(),
        wasSkipped: true       // NUEVO: Marcar explícitamente como saltado
      };
      
      // Actualizar los drills completados inmediatamente
      const updatedDrills = [...completedDrills, result];
      setCompletedDrills(updatedDrills);
      
      // Notificar el resultado inmediatamente a StudySession para actualizar los contadores
      if (onDrillComplete) {
        onDrillComplete(updatedDrills);
      }
    }
    
    goToNextDrill();
  };
  
  /**
   * TERMINAR SESIÓN
   */
  const endSession = () => {
    setIsSessionActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (onSessionEnd) {
      onSessionEnd(completedDrills);
    }
  };
  
  /**
   * TIMER DE SESIÓN
   */
  useEffect(() => {
    if (isSessionActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isSessionActive, timeRemaining]);
  
  /**
   * INICIALIZAR SESIÓN
   */
  useEffect(() => {
    const queue = generateInitialQueue();
    setDrillQueue(queue);
    if (queue.length > 0) {
      setCurrentDrill(queue[0]);
      setDrillQueue(queue.slice(1));
    }
  }, []);
  
  /**
   * CALCULAR ESTADÍSTICAS
   */
  const getStats = () => {
    const total = completedDrills.length;
    const correct = completedDrills.filter(d => d.isCorrect).length;
    // NUEVO: Contar ejercicios saltados separadamente
    const skipped = completedDrills.filter(d => d.wasSkipped === true).length;
    // Incorrectos son los que NO fueron correctos Y NO fueron saltados
    const incorrect = completedDrills.filter(d => !d.isCorrect && !d.wasSkipped).length;
    // Precisión se calcula solo con los ejercicios intentados (no saltados)
    const attempted = total - skipped;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    
    return { total, correct, incorrect, skipped, accuracy, attempted };
  };
  
  const stats = getStats();
  // Progress bar removida - no sabemos cuántos ejercicios habrá en total
  
  
  // Si no hay sesión activa
  if (!isSessionActive) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          ¡Sesión Completada!
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Total de ejercicios: {stats.total}
        </Typography>
        {/* Mostrar desglose completo de resultados */}
        <Typography variant="body1" sx={{ color: 'success.main', mb: 0.5 }}>
          ✓ Respuestas correctas: {stats.correct}
        </Typography>
        <Typography variant="body1" sx={{ color: 'error.main', mb: 0.5 }}>
          ✗ Respuestas incorrectas: {stats.incorrect}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          ⤳ Ejercicios saltados: {stats.skipped}
        </Typography>
        {/* Mostrar precisión solo si hubo ejercicios intentados */}
        {stats.attempted > 0 && (
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
            Precisión (sin contar saltados): {stats.accuracy}%
          </Typography>
        )}
      </Box>
    );
  }
  
  // Si no hay drill actual
  if (!currentDrill) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Cargando ejercicios...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',  // Prevenir scroll del contenedor principal
      position: 'relative'
    }} data-testid="drill-session">
      {/* Header removido - Las estadísticas ahora están en el header principal de StudySession */}
      
      {/* DRILL ACTUAL - Usar todo el espacio disponible para mejor visualización */}
      <Box sx={{ 
        flex: 1, 
        minHeight: 0,  // Importante para que flex funcione correctamente
        overflow: 'hidden',  // NO scroll - debe caber todo
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  // Centrar verticalmente el contenido
        alignItems: 'center',
        px: { xs: 0.5, sm: 1, md: 2, lg: 3 },  // Menos padding horizontal
        py: { xs: 0.5, sm: 1, md: 1 }  // Mínimo padding vertical
      }}>
        <Fade in key={currentDrill.id}>
          <Box sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', sm: '100%', md: 600, lg: 650, xl: 700 },  // Ancho más contenido
            height: '100%',  // Ocupar toda la altura disponible
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',  // Estirar contenido horizontalmente
            justifyContent: 'center',  // Centrar verticalmente
          }}>
            {/* Contenedor wrapper para controlar el tamaño del drill card */}
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              // Sobreescribir estilos del drill card
              '& > div': {
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '& > .MuiPaper-root': {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'  // Prevenir scroll - el contenido debe ajustarse
                }
              }
            }}>
              {/* Multiple Choice tradicional - usando el componente correcto */}
              {currentDrill.type === 'multipleChoice' && (
                <MultipleChoiceDrillCard
                  currentWord={currentDrill.word}
                  allWords={selectedWords}
                  questionType={currentDrill.questionType || 'latinToSpanish'}
                  onAnswer={handleDrillAnswer}
                  numberOfOptions={4}
                  showLabels={false}  // Sin labels para modo drill
                  hideHeader={true}  // Ocultar header para ahorrar espacio
                />
              )}
              
              {/* Multiple Choice de Declinación - usando el componente correcto */}
              {currentDrill.type === 'multipleChoiceDeclension' && (
                <MultipleChoiceDeclensionCard
                  currentWord={currentDrill.word}
                  onAnswer={handleDrillAnswer}
                  showLabels={true}  // IMPORTANTE: Mostrar labels para ver las explicaciones educativas
                  compact={false}  // Usar versión completa
                  hideHeader={true}  // Ocultar header para ahorrar espacio
                />
              )}
              
              {/* Escribir en Latín - ejercicio de escritura completa */}
              {currentDrill.type === 'typeLatinWord' && (
                <TypeLatinWordDrillCard
                  currentWord={currentDrill.word}
                  onAnswer={handleDrillAnswer}
                  showLabels={true}  // Mostrar ayudas y labels
                  compact={false}  // Usar versión completa
                  hideHeader={true}  // Ocultar header para ahorrar espacio
                />
              )}
            </Box>
          </Box>
        </Fade>
      </Box>
      
      {/* CONTROLES DE NAVEGACIÓN - En la parte inferior en móvil */}
      <Box sx={{ 
        mt: 'auto',  // Empujar al fondo del contenedor flex
        pt: { xs: 1, sm: 2 },  // Padding superior
        pb: { xs: 2, sm: 1 },  // Más padding inferior en móvil para separar del borde
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        flexShrink: 0,  // No permitir que se encoja
        // En móvil, fijar los botones cerca del fondo
        position: { xs: 'sticky', sm: 'relative' },
        bottom: { xs: 0, sm: 'auto' }
        // Removed borderTop and borderColor - cards already have their own borders
      }}>
        {!hasAnswered && (
          <Button
            variant="outlined"
            size="large"  // Make the button larger for better touch targets
            startIcon={<SkipNextIcon />}
            onClick={skipDrill}
            sx={{ 
              // IMPORTANTE: Mismo tamaño que el botón "Siguiente Ejercicio"
              // px: padding horizontal (izquierda y derecha)
              // py: padding vertical (arriba y abajo)
              px: 4,      // 32px horizontal padding - IGUAL que "Siguiente"
              py: 1.5,    // 12px vertical padding - IGUAL que "Siguiente"
              // Asegurar tamaño mínimo para touch en móvil (48x48px)
              minHeight: { xs: 48, sm: 'auto' },
              // Mismo tamaño de fuente que "Siguiente" para consistencia visual
              fontSize: { xs: '1rem', sm: '0.9375rem' },
              // Asegurar que el botón tenga el mismo ancho visual
              // minWidth ayuda a que ambos botones se vean del mismo tamaño
              minWidth: 180  // Ancho mínimo para consistencia
            }}
          >
            Saltar
          </Button>
        )}
        
        {hasAnswered && (
          <Fade in>
            <Button
              variant="contained"
              size="large"
              endIcon={<NavigateNextIcon />}
              onClick={goToNextDrill}
              color="primary"
              sx={{ 
                px: 4,      // 32px horizontal padding
                py: 1.5,    // 12px vertical padding
                // Mismo ancho mínimo que el botón "Saltar" para consistencia
                minWidth: 180,  // Ancho mínimo para que ambos se vean igual
                // Asegurar tamaño mínimo para touch en móvil
                minHeight: { xs: 48, sm: 'auto' },
                fontSize: { xs: '1rem', sm: '0.9375rem' }
              }}
            >
              Siguiente Ejercicio
            </Button>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default DrillSessionComponent;

/**
 * RESUMEN DE RESPONSABILIDADES:
 * 
 * DrillSessionComponent:
 * - ✅ Genera drills aleatorios
 * - ✅ Maneja la navegación
 * - ✅ Tracking de respuestas
 * - ✅ Control del tiempo
 * - ✅ Estadísticas en tiempo real
 * 
 * Drill Cards (MultipleChoice, etc):
 * - ✅ Solo muestran el ejercicio
 * - ✅ Reportan si la respuesta es correcta
 * - ❌ NO manejan navegación
 * - ❌ NO tienen botón "Siguiente"
 * 
 * FLUJO:
 * 1. DrillSession genera drills aleatorios
 * 2. Muestra el drill actual
 * 3. Drill reporta respuesta (correcta/incorrecta)
 * 4. DrillSession registra resultado
 * 5. DrillSession maneja navegación al siguiente
 * 6. Repite hasta que termine el tiempo
 */