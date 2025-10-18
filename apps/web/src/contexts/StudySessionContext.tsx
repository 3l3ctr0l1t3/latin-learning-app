/**
 * STUDY SESSION CONTEXT
 * 
 * Context para manejar el estado global de la sesión de estudio.
 * Permite a cualquier componente saber si estamos en una sesión activa.
 * 
 * CONCEPTOS IMPORTANTES:
 * - Context API: Forma de React para compartir datos entre componentes sin prop drilling
 * - Provider: Componente que envuelve la app y provee el contexto
 * - Consumer/Hook: Forma de acceder a los datos del contexto
 * - Global State: Estado compartido entre múltiples componentes
 * 
 * ¿POR QUÉ USAR CONTEXT?
 * - Evita pasar props a través de múltiples niveles (prop drilling)
 * - Permite que componentes distantes compartan estado
 * - Ideal para estados globales como temas, autenticación, o sesiones activas
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * TIPO DE DATOS DEL CONTEXTO
 * 
 * Define qué información y funciones estarán disponibles en el contexto
 */
interface StudySessionContextType {
  // Estado: ¿Hay una sesión de estudio activa?
  isInStudySession: boolean;
  
  // Función para activar el modo de sesión de estudio
  enterStudySession: () => void;
  
  // Función para salir del modo de sesión de estudio
  exitStudySession: () => void;
  
  // Estado adicional: ¿Mostrar header con animación?
  headerVisible: boolean;
}

/**
 * CREAR EL CONTEXTO
 * 
 * createContext crea un objeto Context que tiene:
 * - Provider: componente que provee el valor
 * - Consumer: componente para consumir el valor (menos usado ahora)
 * 
 * El valor inicial (undefined) solo se usa si no hay Provider
 */
const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

/**
 * PROVIDER COMPONENT
 * 
 * Este componente envuelve la aplicación y provee el contexto a todos sus hijos.
 * Maneja el estado real y las funciones para modificarlo.
 * 
 * @param children - Los componentes hijos que tendrán acceso al contexto
 */
export const StudySessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado local que será compartido a través del contexto
  const [isInStudySession, setIsInStudySession] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  
  /**
   * ENTRAR EN SESIÓN DE ESTUDIO
   * 
   * Activa el modo de sesión y desliza el header hacia arriba con transform
   * La animación es suave porque usa translateY sin causar reflow del layout
   */
  const enterStudySession = () => {
    // Iniciamos la animación de deslizar el header hacia arriba
    // El header se mueve con transform: translateY(-100%)
    setHeaderVisible(false);
    
    // Marcamos inmediatamente que estamos en sesión
    // Ya no necesitamos delay porque transform no causa layout shift
    setIsInStudySession(true);
  };
  
  /**
   * SALIR DE SESIÓN DE ESTUDIO
   * 
   * Desactiva el modo de sesión y desliza el header de vuelta hacia abajo
   * El header vuelve suavemente con transform: translateY(0)
   */
  const exitStudySession = () => {
    // Marcamos que ya no estamos en sesión
    setIsInStudySession(false);
    
    // Mostramos el header inmediatamente con animación de deslizamiento
    // La transición CSS con cubic-bezier maneja el timing suave
    setHeaderVisible(true);
  };
  
  // Valor que será provisto a todos los componentes hijos
  const value: StudySessionContextType = {
    isInStudySession,
    enterStudySession,
    exitStudySession,
    headerVisible
  };
  
  // Provider envuelve a los children y les da acceso al value
  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};

/**
 * CUSTOM HOOK PARA USAR EL CONTEXTO
 * 
 * Hook personalizado que simplifica el uso del contexto.
 * Incluye validación para asegurar que se use dentro del Provider.
 * 
 * @returns El valor del contexto
 * @throws Error si se usa fuera del Provider
 * 
 * EJEMPLO DE USO:
 * ```tsx
 * const { isInStudySession, enterStudySession } = useStudySession();
 * ```
 */
export const useStudySession = (): StudySessionContextType => {
  // useContext obtiene el valor actual del contexto
  const context = useContext(StudySessionContext);
  
  // Validación: asegurar que el hook se use dentro del Provider
  if (context === undefined) {
    throw new Error(
      'useStudySession debe ser usado dentro de un StudySessionProvider. ' +
      'Asegúrate de que tu componente esté envuelto en <StudySessionProvider>'
    );
  }
  
  return context;
};

/**
 * EXPORTAR TIPOS
 * 
 * Exportamos el tipo por si algún componente necesita usarlo directamente
 */
export type { StudySessionContextType };