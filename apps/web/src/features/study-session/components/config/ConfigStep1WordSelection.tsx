/**
 * CONFIG STEP 1: WORD SELECTION
 * 
 * Primer paso de la configuración de sesión de estudio.
 * Permite al usuario seleccionar las palabras que quiere practicar.
 * 
 * Este componente está optimizado para usar el mínimo espacio vertical
 * manteniendo toda la funcionalidad accesible.
 */

import React from 'react';
import { Box } from '@mui/material';
import WordSelectionStep from './WordSelectionStep';
import type { LatinWord } from '../../../../components/global/WordCard';

/**
 * PROPS DEL COMPONENTE
 */
interface ConfigStep1WordSelectionProps {
  // Palabras actualmente seleccionadas
  selectedWords: LatinWord[];
  // Callback cuando cambia la selección
  onSelectionChange: (words: LatinWord[]) => void;
  // Configuración de límites
  minWords?: number;
  maxWords?: number;
}

/**
 * COMPONENTE STEP 1: SELECCIÓN DE PALABRAS
 * 
 * Versión optimizada del paso 1 con espaciado mínimo.
 * Delega toda la funcionalidad al WordSelectionStep pero
 * controla el layout para optimizar el espacio.
 */
const ConfigStep1WordSelection: React.FC<ConfigStep1WordSelectionProps> = ({
  selectedWords,
  onSelectionChange,
  minWords = 5,
  maxWords = 30,
}) => {
  // Directamente retornar WordSelectionStep sin wrapper innecesario
  // Este componente actúa como un alias con valores por defecto
  return (
    <Box data-testid="config-step1-word-selection">
      <WordSelectionStep
        selectedWords={selectedWords}
        onSelectionChange={onSelectionChange}
        minWords={minWords}
        maxWords={maxWords}
      />
    </Box>
  );
};

export default ConfigStep1WordSelection;