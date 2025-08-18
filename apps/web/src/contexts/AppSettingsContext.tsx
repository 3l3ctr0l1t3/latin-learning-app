/**
 * APP SETTINGS CONTEXT - Manejo global de configuraciones de la aplicación
 * 
 * Este archivo crea un "contexto" de React para manejar configuraciones
 * que afectan a toda la aplicación, como el tamaño de fuente.
 * 
 * ¿QUÉ ES UN CONTEXT EN REACT?
 * Context es una forma de compartir datos entre componentes sin tener que
 * pasar props manualmente en cada nivel del árbol de componentes.
 * Es como crear variables globales pero de forma controlada y eficiente.
 * 
 * ¿CÓMO FUNCIONA?
 * 1. Creamos un contexto con createContext()
 * 2. Creamos un Provider que envuelve la app y provee los valores
 * 3. Los componentes hijos usan useContext() para acceder a los valores
 * 
 * VENTAJAS:
 * - Evita "prop drilling" (pasar props a través de muchos niveles)
 * - Centraliza el estado global de la aplicación
 * - Facilita el acceso a configuraciones desde cualquier componente
 */

// Import React hooks and types
// We use "import type" for types that are only used in TypeScript
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * TIPOS DE TAMAÑO DE FUENTE DISPONIBLES
 * 
 * Definimos los tamaños disponibles como un tipo literal de TypeScript.
 * Esto significa que solo estos 4 valores son válidos para fontSize.
 * 
 * Los multiplicadores están basados en estudios de accesibilidad:
 * - small (0.875x): Para usuarios que prefieren más contenido visible
 * - medium (1.0x): Tamaño por defecto, óptimo para la mayoría
 * - large (1.125x): Mejora la legibilidad sin sacrificar mucho espacio
 * - extraLarge (1.25x): Para usuarios con dificultades visuales
 */
export type FontSizeOption = 'small' | 'medium' | 'large' | 'extraLarge';

/**
 * MAPEO DE OPCIONES A MULTIPLICADORES
 * 
 * Este objeto mapea cada opción de tamaño a su multiplicador numérico.
 * Estos valores se aplicarán a todos los tamaños de tipografía del tema.
 * 
 * Por ejemplo, si el tamaño base es 16px:
 * - small: 16px × 0.875 = 14px
 * - medium: 16px × 1.0 = 16px
 * - large: 16px × 1.125 = 18px
 * - extraLarge: 16px × 1.25 = 20px
 */
export const FONT_SIZE_SCALES: Record<FontSizeOption, number> = {
  small: 0.875,      // 87.5% del tamaño original
  medium: 1.0,       // 100% - tamaño por defecto
  large: 1.125,      // 112.5% del tamaño original
  extraLarge: 1.25,  // 125% del tamaño original
};

/**
 * ETIQUETAS EN ESPAÑOL
 * 
 * Labels para mostrar en la interfaz de usuario.
 * Siempre usamos español para el texto que ve el usuario.
 */
export const FONT_SIZE_LABELS: Record<FontSizeOption, string> = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
  extraLarge: 'Extra Grande',
};

/**
 * INTERFACE PARA EL CONTEXTO DE CONFIGURACIONES
 * 
 * Define la estructura de datos que estará disponible en el contexto.
 * Es como un contrato que especifica qué valores y funciones proveerá.
 * 
 * @property fontSize - El tamaño de fuente actual seleccionado
 * @property fontScale - El multiplicador numérico correspondiente al tamaño
 * @property setFontSize - Función para cambiar el tamaño de fuente
 * @property resetSettings - Función para restaurar configuraciones por defecto
 */
interface AppSettingsContextType {
  fontSize: FontSizeOption;
  fontScale: number;
  setFontSize: (size: FontSizeOption) => void;
  resetSettings: () => void;
}

/**
 * VALORES POR DEFECTO
 * 
 * Configuraciones iniciales que se usan cuando:
 * - El usuario abre la app por primera vez
 * - No hay configuraciones guardadas en localStorage
 * - Se llama a resetSettings()
 */
const DEFAULT_SETTINGS = {
  fontSize: 'medium' as FontSizeOption,
  fontScale: 1.0,
};

/**
 * CLAVE PARA LOCALSTORAGE
 * 
 * localStorage es una API del navegador que permite guardar datos
 * que persisten incluso después de cerrar el navegador.
 * 
 * Usamos una clave única para identificar nuestros datos.
 * El prefijo 'latinApp' evita conflictos con otros datos.
 */
const STORAGE_KEY = 'latinApp_settings';

/**
 * CREAR EL CONTEXTO
 * 
 * createContext crea un nuevo contexto de React.
 * El valor undefined inicial se reemplazará cuando usemos el Provider.
 * 
 * El "!" al final le dice a TypeScript que sabemos que el valor
 * no será undefined cuando se use (porque siempre estará dentro del Provider).
 */
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

/**
 * PROVIDER COMPONENT - Componente que provee el contexto a la aplicación
 * 
 * Este componente envuelve la aplicación y hace que las configuraciones
 * estén disponibles para todos los componentes hijos.
 * 
 * @param children - Los componentes hijos que tendrán acceso al contexto
 * 
 * FLUJO DE DATOS:
 * 1. Al montar: Lee configuraciones de localStorage
 * 2. Durante uso: Actualiza estado y guarda en localStorage
 * 3. Al cambiar: Notifica a todos los componentes que usan el contexto
 */
export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * ESTADO LOCAL DEL PROVIDER
   * 
   * useState es un Hook de React que permite agregar estado a componentes funcionales.
   * Retorna un array con dos elementos:
   * 1. El valor actual del estado (fontSize)
   * 2. Una función para actualizar el estado (setFontSizeState)
   * 
   * El estado inicial es el tamaño por defecto ('medium')
   */
  const [fontSize, setFontSizeState] = useState<FontSizeOption>(DEFAULT_SETTINGS.fontSize);
  
  /**
   * EFECTO PARA CARGAR CONFIGURACIONES GUARDADAS
   * 
   * useEffect es un Hook que ejecuta código después de que el componente se renderiza.
   * Se usa para "efectos secundarios" como:
   * - Llamadas a APIs
   * - Suscripciones a eventos
   * - Manipulación del DOM
   * - Lectura/escritura de localStorage
   * 
   * El array vacío [] al final significa que este efecto solo se ejecuta una vez,
   * cuando el componente se monta (aparece en pantalla por primera vez).
   */
  useEffect(() => {
    // Función para cargar configuraciones de localStorage
    const loadSettings = () => {
      try {
        // localStorage.getItem() lee un valor guardado
        // Retorna null si no existe la clave
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        
        if (savedSettings) {
          // JSON.parse() convierte un string JSON a objeto JavaScript
          // Usamos any aquí porque no sabemos qué estructura tiene el JSON guardado
          // Luego validamos que tenga la estructura esperada
          const parsed = JSON.parse(savedSettings) as { fontSize?: unknown };
          
          // Validar que el valor guardado sea válido
          // Verificamos que fontSize sea una de las opciones permitidas
          // Usamos typeof para verificar que es un string antes de verificar si está en FONT_SIZE_SCALES
          if (
            parsed.fontSize && 
            typeof parsed.fontSize === 'string' && 
            parsed.fontSize in FONT_SIZE_SCALES
          ) {
            setFontSizeState(parsed.fontSize as FontSizeOption);
            
            // Log para debugging (se puede ver en la consola del navegador)
            console.log('Configuraciones cargadas de localStorage:', parsed);
          }
        }
      } catch (error) {
        // Si hay error al leer o parsear, usamos valores por defecto
        // Esto puede pasar si los datos están corruptos
        console.error('Error al cargar configuraciones:', error);
        // No hacemos nada más, se usarán los valores por defecto
      }
    };
    
    // Ejecutar la función de carga
    loadSettings();
  }, []); // Array vacío = ejecutar solo al montar el componente
  
  /**
   * FUNCIÓN PARA CAMBIAR EL TAMAÑO DE FUENTE
   * 
   * Esta función:
   * 1. Actualiza el estado local
   * 2. Guarda la nueva configuración en localStorage
   * 3. Dispara un re-render de todos los componentes que usan el contexto
   * 
   * @param newSize - El nuevo tamaño de fuente seleccionado
   */
  const setFontSize = (newSize: FontSizeOption) => {
    // Actualizar el estado de React
    setFontSizeState(newSize);
    
    // Guardar en localStorage para persistencia
    try {
      // Crear objeto con todas las configuraciones
      const settings = {
        fontSize: newSize,
        // Aquí podríamos agregar más configuraciones en el futuro
        // Por ejemplo: theme: 'dark', language: 'es', etc.
      };
      
      // JSON.stringify() convierte objeto JavaScript a string JSON
      // localStorage solo puede guardar strings, no objetos
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      
      console.log('Configuraciones guardadas en localStorage:', settings);
    } catch (error) {
      // localStorage puede fallar si:
      // - El usuario lo tiene deshabilitado
      // - Se excede el límite de almacenamiento (usualment 5-10MB)
      // - Modo incógnito en algunos navegadores
      console.error('Error al guardar configuraciones:', error);
    }
  };
  
  /**
   * FUNCIÓN PARA RESTAURAR CONFIGURACIONES POR DEFECTO
   * 
   * Útil para agregar un botón "Restaurar valores por defecto"
   * en la configuración de la aplicación.
   */
  const resetSettings = () => {
    setFontSize(DEFAULT_SETTINGS.fontSize);
    
    // Opcional: También limpiar localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Configuraciones restauradas a valores por defecto');
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };
  
  /**
   * CALCULAR EL MULTIPLICADOR ACTUAL
   * 
   * Convertimos la opción de tamaño (string) a su valor numérico
   * Este valor se usará para escalar toda la tipografía del tema
   */
  const fontScale = FONT_SIZE_SCALES[fontSize];
  
  /**
   * VALOR DEL CONTEXTO
   * 
   * Este objeto contiene todos los valores y funciones que estarán
   * disponibles para los componentes que usen useAppSettings()
   */
  const contextValue: AppSettingsContextType = {
    fontSize,
    fontScale,
    setFontSize,
    resetSettings,
  };
  
  /**
   * RENDERIZAR EL PROVIDER
   * 
   * Provider es un componente especial que "provee" el contexto
   * a todos sus componentes hijos a través del árbol de componentes.
   * 
   * El prop 'value' es lo que estará disponible cuando se use useContext()
   */
  return (
    <AppSettingsContext.Provider value={contextValue}>
      {children}
    </AppSettingsContext.Provider>
  );
};

/**
 * CUSTOM HOOK PARA USAR EL CONTEXTO
 * 
 * Un custom hook es una función que empieza con "use" y puede usar otros hooks.
 * Este hook simplifica el uso del contexto y agrega validación de errores.
 * 
 * En lugar de:
 *   const context = useContext(AppSettingsContext);
 *   if (!context) throw error;
 * 
 * Los componentes pueden simplemente hacer:
 *   const { fontSize, setFontSize } = useAppSettings();
 * 
 * @returns El contexto de configuraciones de la app
 * @throws Error si se usa fuera del Provider
 */
export const useAppSettings = (): AppSettingsContextType => {
  // useContext es un Hook que permite acceder al valor del contexto
  const context = useContext(AppSettingsContext);
  
  // Validación: Asegurar que el hook se use dentro del Provider
  // Si context es undefined, significa que el componente no está
  // envuelto por AppSettingsProvider
  if (!context) {
    throw new Error(
      'useAppSettings debe ser usado dentro de AppSettingsProvider. ' +
      'Asegúrate de que tu componente esté envuelto por <AppSettingsProvider>'
    );
  }
  
  return context;
};

// Los tipos y constantes ya están exportados arriba con su definición,
// no necesitamos exportarlos de nuevo aquí