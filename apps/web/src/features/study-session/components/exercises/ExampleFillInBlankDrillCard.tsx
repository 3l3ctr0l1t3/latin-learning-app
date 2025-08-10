/**
 * EXAMPLE: FILL IN THE BLANK DRILL CARD
 * 
 * Este es un EJEMPLO de cómo crear un nuevo tipo de drill card
 * usando BaseDrillCard como "clase base" mediante composición.
 * 
 * PASOS PARA CREAR UN NUEVO DRILL CARD:
 * 1. Importar BaseDrillCard
 * 2. Crear tu componente de ejercicio específico
 * 3. Usar BaseDrillCard pasándole tu contenido
 */

import React, { useState } from 'react';
import BaseDrillCard from './BaseDrillCard';
import { Box, TextField, Typography } from '@mui/material';
import type { LatinWord } from '../WordCard';
import EditIcon from '@mui/icons-material/Edit';

interface FillInBlankDrillCardProps {
  currentWord: LatinWord;
  onAnswer?: (isCorrect: boolean) => void;
  compact?: boolean;
}

/**
 * EJEMPLO DE NUEVO DRILL CARD
 * 
 * Este componente "hereda" de BaseDrillCard mediante composición.
 * Solo necesita:
 * 1. Definir su lógica específica
 * 2. Crear su contenido de ejercicio
 * 3. Pasar todo a BaseDrillCard
 */
const FillInBlankDrillCard: React.FC<FillInBlankDrillCardProps> = ({
  currentWord,
  onAnswer,
  compact = false
}) => {
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = userInput.toLowerCase().trim() === currentWord.spanishTranslation.toLowerCase();
    setIsAnswered(true);
    setIsCorrect(correct);
    if (onAnswer) onAnswer(correct);
  };

  // handleNext removed - navigation handled by DrillSessionComponent

  /**
   * AQUÍ ESTÁ LA "MAGIA" DE LA COMPOSICIÓN
   * 
   * En lugar de heredar, componemos:
   * - BaseDrillCard provee la estructura común
   * - Nosotros proveemos el contenido específico
   */
  return (
    <BaseDrillCard
      // Información del ejercicio
      title="Completar la Traducción"
      subtitle="Escribe la traducción en español"
      icon={<EditIcon />}
      exerciseType="Completar"
      
      // Estado
      isAnswered={isAnswered}
      isCorrect={isCorrect}
      
      // Callbacks removed - navigation handled by DrillSessionComponent
      
      // Visual
      compact={compact}
      
      // CONTENIDO ESPECÍFICO DEL EJERCICIO
      exerciseContent={
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {currentWord.nominative}, {currentWord.genitive}
          </Typography>
          
          <TextField
            label="Traducción en español"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isAnswered) {
                handleSubmit();
              }
            }}
            disabled={isAnswered}
            fullWidth
            sx={{ maxWidth: 300, mx: 'auto' }}
          />
          
          {!isAnswered && userInput && (
            <Box sx={{ mt: 2 }}>
              <button onClick={handleSubmit}>
                Verificar Respuesta
              </button>
            </Box>
          )}
        </Box>
      }
      
      // Feedback adicional
      feedbackContent={
        isAnswered && !isCorrect && (
          <span>Tu respuesta: "{userInput}"</span>
        )
      }
    />
  );
};

export default FillInBlankDrillCard;

/**
 * RESUMEN: CÓMO FUNCIONA LA "HERENCIA" EN REACT
 * 
 * 1. NO HAY HERENCIA DE CLASES
 *    React no usa `extends` como en Java/C#
 * 
 * 2. USAMOS COMPOSICIÓN
 *    Componemos componentes más grandes desde más pequeños
 * 
 * 3. PATRÓN BASE + ESPECÍFICO
 *    - BaseDrillCard = Comportamiento común (como clase abstracta)
 *    - MultipleChoiceDrillCard = Implementación específica
 *    - FillInBlankDrillCard = Otra implementación específica
 * 
 * 4. VENTAJAS
 *    - Más flexible que herencia
 *    - Evita problemas de herencia múltiple
 *    - Más fácil de entender y mantener
 *    - Puedes cambiar la "base" en runtime
 * 
 * 5. EQUIVALENCIA CON OOP
 *    ```java
 *    // En Java
 *    abstract class BaseDrillCard {
 *      abstract renderExercise();
 *      render() {
 *        showHeader();
 *        renderExercise(); // método abstracto
 *        showFooter();
 *      }
 *    }
 *    
 *    class MultipleChoiceDrillCard extends BaseDrillCard {
 *      renderExercise() { ... }
 *    }
 *    ```
 *    
 *    ```tsx
 *    // En React
 *    <BaseDrillCard
 *      exerciseContent={<MyExercise />}  // "override" del método
 *    />
 *    ```
 */