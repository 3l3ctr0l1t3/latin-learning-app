/**
 * PAGE LAYOUT CONFIGURATION
 * 
 * Configuración centralizada para el layout de todas las páginas.
 * Basado en Material Design 3 y mejores prácticas para diseño responsivo.
 * 
 * CONCEPTOS IMPORTANTES:
 * - 8-point grid system: Todos los espaciados son múltiplos de 8px
 * - Mobile-first: Los valores base son para móvil, luego se escalan
 * - Consistency: Usar estos valores en todas las páginas para coherencia
 * 
 * SISTEMA DE ESPACIADO (Material Design 3):
 * - xs (móvil): 16px de margen/padding base
 * - sm (tablet pequeña): 24px 
 * - md (desktop): 32-40px
 * - lg/xl (desktop grande): 48-64px
 */

/**
 * CONFIGURACIÓN DE PADDING PARA PÁGINAS
 * 
 * Estos valores se aplican al contenido principal de cada página.
 * Siguen el sistema de 8 puntos de Material Design.
 */
export const PAGE_PADDING = {
  // Padding horizontal (izquierda y derecha)
  horizontal: {
    xs: 2,    // 16px en móvil (2 * 8px)
    sm: 3,    // 24px en tablet pequeña
    md: 4,    // 32px en desktop
    lg: 5,    // 40px en desktop grande
    xl: 6     // 48px en desktop extra grande
  },
  // Padding vertical (arriba y abajo)
  vertical: {
    xs: 2,    // 16px en móvil
    sm: 3,    // 24px en tablet
    md: 4,    // 32px en desktop
    lg: 5,    // 40px en desktop grande
    xl: 6     // 48px en desktop extra grande
  },
  // Padding para contenido interno de tarjetas/cards
  card: {
    xs: 1.5,  // 12px en móvil (más compacto)
    sm: 2,    // 16px en tablet
    md: 3,    // 24px en desktop
    lg: 3.5,  // 28px en desktop grande
    xl: 4     // 32px en desktop extra grande
  }
} as const;

/**
 * CONFIGURACIÓN DE MÁRGENES ENTRE SECCIONES
 * 
 * Espaciado entre diferentes secciones de contenido.
 */
export const SECTION_SPACING = {
  small: {
    xs: 2,    // 16px
    sm: 2.5,  // 20px
    md: 3,    // 24px
  },
  medium: {
    xs: 3,    // 24px
    sm: 4,    // 32px
    md: 5,    // 40px
  },
  large: {
    xs: 4,    // 32px
    sm: 5,    // 40px
    md: 6,    // 48px
  }
} as const;

/**
 * CONFIGURACIÓN DE CONTENEDORES DE PÁGINA
 * 
 * Dimensiones y estilos para contenedores de página completa.
 */
export const PAGE_CONTAINER = {
  // Altura mínima (considerando el header de la app)
  minHeight: 'calc(100vh - 110px)',  // Altura completa menos el header
  
  // Anchos máximos para diferentes tipos de contenido
  maxWidth: {
    compact: {
      md: '800px',
      lg: '900px',
      xl: '1000px'
    },
    standard: {
      md: '900px',
      lg: '1100px',
      xl: '1300px'
    },
    wide: {
      md: '1200px',
      lg: '1400px',
      xl: '1600px'
    }
  },
  
  // Alturas fijas para contenedores tipo "card" en desktop
  cardHeight: {
    sm: '600px',
    md: '650px',
    lg: '700px',
    xl: '750px'
  }
} as const;

/**
 * HELPER FUNCTION: Obtener sx props para contenedor de página
 * 
 * @param type - Tipo de contenedor ('full', 'fullscreen', 'card', 'content')
 * @param width - Ancho del contenedor ('compact', 'standard', 'wide')
 * @returns Objeto sx para MUI
 * 
 * TIPOS DE CONTENEDOR:
 * - 'fullscreen': Pantalla completa (100vh) para sesiones de estudio
 * - 'full': Página completa con consideración del header
 * - 'card': Contenedor tipo tarjeta con altura fija
 * - 'content': Contenedor simple de contenido
 */
export const getPageContainerSx = (
  type: 'full' | 'fullscreen' | 'card' | 'content' = 'full',
  width: 'compact' | 'standard' | 'wide' = 'standard'
): any => {
  // Contenedor de pantalla completa para sesión de estudio (sin header)
  if (type === 'fullscreen') {
    return {
      // Layout base - pantalla completa
      minHeight: '100vh',  // Altura completa de la ventana
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Sin padding en móvil, padding normal en desktop
      px: {
        xs: 0,  // Sin padding en móvil (pantalla completa)
        md: PAGE_PADDING.horizontal.md,
        lg: PAGE_PADDING.horizontal.lg,
        xl: PAGE_PADDING.horizontal.xl
      },
      py: {
        xs: 0,  // Sin padding en móvil
        md: PAGE_PADDING.vertical.md
      }
    };
  }
  
  // Contenedor de página completa (como StudySession y StudySessionConfig)
  if (type === 'full') {
    return {
      // Layout base
      minHeight: PAGE_CONTAINER.minHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Padding responsivo
      px: {
        xs: 0,  // Sin padding en móvil (pantalla completa)
        md: PAGE_PADDING.horizontal.md,
        lg: PAGE_PADDING.horizontal.lg,
        xl: PAGE_PADDING.horizontal.xl
      },
      py: {
        xs: 0,  // Sin padding en móvil
        md: PAGE_PADDING.vertical.md
      }
    };
  }
  
  // Contenedor tipo tarjeta (contenido interno de páginas)
  if (type === 'card') {
    return {
      // Dimensiones
      width: '100%',
      maxWidth: PAGE_CONTAINER.maxWidth[width],
      height: {
        xs: '100vh',  // Altura completa de ventana en móvil para sesiones
        sm: PAGE_CONTAINER.cardHeight.sm,
        md: PAGE_CONTAINER.cardHeight.md,
        lg: PAGE_CONTAINER.cardHeight.lg,
        xl: PAGE_CONTAINER.cardHeight.xl
      },
      // Layout
      display: 'flex',
      flexDirection: 'column',
      // Estilo visual - ahora con fondo en todas las pantallas
      boxShadow: { xs: 0, sm: 1, md: 3 },  // Sombra sutil en SM, más pronunciada en MD+
      borderRadius: { xs: 0, sm: 1, md: 2 },  // Bordes redondeados desde SM
      bgcolor: 'background.paper',  // Fondo consistente en todos los tamaños
      border: { xs: 'none', sm: '1px solid', md: '1px solid' },  // Borde desde SM
      borderColor: { sm: 'divider', md: 'divider' },  // Color del borde
      // Padding interno
      p: {
        xs: PAGE_PADDING.card.xs,
        sm: PAGE_PADDING.card.sm,
        md: PAGE_PADDING.card.md,
        lg: PAGE_PADDING.card.lg,
        xl: PAGE_PADDING.card.xl
      }
    };
  }
  
  // Contenedor de contenido simple (como Homepage)
  return {
    py: {
      xs: PAGE_PADDING.vertical.xs,
      sm: PAGE_PADDING.vertical.sm,
      md: PAGE_PADDING.vertical.md
    }
  };
};

/**
 * CONFIGURACIÓN DE TOUCH TARGETS
 * 
 * Tamaños mínimos para elementos interactivos en móvil.
 * Basado en Material Design guidelines.
 */
export const TOUCH_TARGETS = {
  minSize: 48,  // 48px mínimo para botones y elementos táctiles
  spacing: 8    // 8px mínimo entre elementos táctiles
} as const;

/**
 * BREAKPOINTS PERSONALIZADOS
 * 
 * Puntos de ruptura para diseño responsivo.
 * Coinciden con los breakpoints de MUI.
 */
export const BREAKPOINTS = {
  xs: 0,      // Móvil pequeño
  sm: 600,    // Móvil grande / Tablet pequeña
  md: 900,    // Tablet / Desktop pequeño
  lg: 1200,   // Desktop
  xl: 1536    // Desktop grande
} as const;