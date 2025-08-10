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
  LinearProgress,
  Stack,
  Chip,
  Fade,
  Button
} from '@mui/material';
import MultipleChoiceDrillCard from './exercises/MultipleChoiceDrillCard';
import MultipleChoiceDeclensionCard from './exercises/MultipleChoiceDeclensionCard';
import type { LatinWord } from './WordCard';
import type { QuestionType } from './exercises/MultipleChoiceExercise';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * TIPOS DE DRILL DISPONIBLES
 */
export type DrillType = 'multipleChoice' | 'multipleChoiceDeclension' | 'fillInBlank' | 'matching' | 'directInput';

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
  onProgress
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
    // Excluimos 'declension' si el tipo es multipleChoice porque ahora tenemos un ejercicio específico
    const questionTypes: QuestionType[] = ['latinToSpanish', 'spanishToLatin', 'gender'];
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
      
      setCompletedDrills(prev => [...prev, result]);
      
      // Notificar progreso
      if (onProgress) {
        onProgress(completedDrills.length + 1, completedDrills.length + drillQueue.length + 1);
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
      // Registrar como incorrecto con tiempo 0
      const result: DrillResult = {
        drillId: currentDrill.id,
        word: currentDrill.word,
        type: currentDrill.type,
        isCorrect: false,
        timeSpent: 0,
        timestamp: Date.now()
      };
      
      setCompletedDrills(prev => [...prev, result]);
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
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { total, correct, accuracy };
  };
  
  const stats = getStats();
  const progress = (completedDrills.length / (completedDrills.length + drillQueue.length + 1)) * 100;
  
  /**
   * FORMATEAR TIEMPO
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Si no hay sesión activa
  if (!isSessionActive) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          ¡Sesión Completada!
        </Typography>
        <Typography variant="body1">
          Total de ejercicios: {stats.total}
        </Typography>
        <Typography variant="body1">
          Respuestas correctas: {stats.correct}
        </Typography>
        <Typography variant="body1">
          Precisión: {stats.accuracy}%
        </Typography>
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
      overflow: 'hidden',  // Prevenir que el contenido se salga
      position: 'relative'
    }} data-testid="drill-session">
      {/* HEADER CON ESTADÍSTICAS Y TIMER */}
      <Box sx={{ 
        flexShrink: 0,  // No permitir que se encoja
        pb: 2  // Padding bottom para separar del contenido
      }}>
        {/* Barra de progreso */}
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 2, height: 8, borderRadius: 1 }}
        />
        
        {/* Estadísticas y timer */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
          sx={{ mb: 2 }}
        >
          {/* Estadísticas */}
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Correctas: ${stats.correct}`}
              color="success"
              size="small"
            />
            <Chip
              icon={<CancelIcon />}
              label={`Incorrectas: ${stats.total - stats.correct}`}
              color="error"
              size="small"
            />
            <Chip
              label={`Precisión: ${stats.accuracy}%`}
              color="primary"
              size="small"
            />
          </Stack>
          
          {/* Timer */}
          <Chip
            label={`Tiempo: ${formatTime(timeRemaining)}`}
            color={timeRemaining < 60 ? 'error' : 'default'}
            size="medium"
          />
        </Stack>
      </Box>
      
      {/* DRILL ACTUAL */}
      <Fade in key={currentDrill.id}>
        <Box sx={{ 
          flex: 1, 
          minHeight: 0,  // Importante para que flex funcione correctamente
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 1, sm: 2 },  // Padding horizontal responsivo
          py: 1
        }}>
          {/* Multiple Choice tradicional */}
          {currentDrill.type === 'multipleChoice' && (
            <Box sx={{ 
              width: '100%', 
              maxWidth: 600,  // Mismo ancho máximo para todos los drills
              mx: 'auto'
            }}>
              <MultipleChoiceDrillCard
                currentWord={currentDrill.word}
                allWords={selectedWords}
                questionType={currentDrill.questionType}
                onAnswer={handleDrillAnswer}
                numberOfOptions={4}
                showLabels={true}
              />
            </Box>
          )}
          
          {/* Multiple Choice de Declinación */}
          {currentDrill.type === 'multipleChoiceDeclension' && (
            <Box sx={{ 
              width: '100%', 
              maxWidth: 600,  // Mismo ancho máximo que otros drills
              mx: 'auto'
            }}>
              <MultipleChoiceDeclensionCard
                currentWord={currentDrill.word}
                onAnswer={handleDrillAnswer}
                showLabels={true}
                compact={false}
              />
            </Box>
          )}
          
          {/* Aquí se agregarían otros tipos de drills cuando se implementen */}
          {currentDrill.type === 'fillInBlank' && (
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography>Fill in Blank - Por implementar</Typography>
              <Button onClick={() => handleDrillAnswer(Math.random() > 0.5)}>
                Simular Respuesta
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
      
      {/* CONTROLES DE NAVEGACIÓN */}
      <Box sx={{ 
        mt: 2, 
        pb: 2,  // Padding bottom para separar del borde
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        flexShrink: 0  // No permitir que se encoja
      }}>
        {!hasAnswered && (
          <Button
            variant="outlined"
            startIcon={<SkipNextIcon />}
            onClick={skipDrill}
            sx={{ px: 3 }}
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
              sx={{ px: 4, py: 1.5 }}
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