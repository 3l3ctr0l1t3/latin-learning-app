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
   * Activa el modo de sesión y oculta el header con animación
   */
  const enterStudySession = () => {
    // Primero iniciamos la animación de ocultar
    setHeaderVisible(false);
    
    // Después de un pequeño delay, marcamos que estamos en sesión
    // Esto permite que la animación se complete suavemente
    setTimeout(() => {
      setIsInStudySession(true);
    }, 150); // 150ms para que coincida con la animación CSS
  };
  
  /**
   * SALIR DE SESIÓN DE ESTUDIO
   * 
   * Desactiva el modo de sesión y muestra el header con animación
   */
  const exitStudySession = () => {
    // Primero marcamos que ya no estamos en sesión
    setIsInStudySession(false);
    
    // Luego mostramos el header con animación
    setTimeout(() => {
      setHeaderVisible(true);
    }, 50); // Pequeño delay para suavizar la transición
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