# GEMINI.md

This file provides guidance to Google Gemini AI when working with code in this repository.

## Project Overview

Latin Learning Application - An interactive, module-based platform for learning Latin through dynamic content and active practice sessions. Built with React, TypeScript, and Material-UI (MUI).

## Current Project Status (Last Updated: 2025-08-17)

### ✅ Completed Features

1. **Core Infrastructure**
   - Monorepo structure with npm workspaces
   - React SPA with Vite build system
   - TypeScript configuration
   - Dark theme with MUI Material Design 3
   - Mobile-responsive design
   - **NEW**: Study Session Context for global state management
   - **NEW**: Smart header hiding during study sessions

2. **Data Layer**
   - 690 Latin words imported and normalized
   - VocabularyService for data operations
   - Case and accent-insensitive search utilities
   - Declension-based color coding system

3. **Study Session System**
   - Three-step configuration flow
   - Word selection with filters (declension, gender)
   - Duration selection (5/10/15 minutes)
   - Drill type selection
   - Word review with swipe/keyboard navigation
   - Session timer with visual progress
   - Exercise components (multiple choice, direct input)
   - **NEW**: Full-screen mode for immersive learning
   - **NEW**: Unified statistics tracking in header
   - **NEW**: Smooth header transitions

4. **Component Organization**
   ```
   /components/global/     - Reusable components (WordCard, SessionTimer, etc.)
   /components/exercises/  - Exercise and drill components
   /contexts/             - React Context providers
     StudySessionContext  - Manages study session state globally
   /features/             - Feature-specific components
     /study-session/components/
       /config/         - Configuration components
       /filters/        - Filter components
       /search/         - Search components
   /config/               - Configuration files
     theme.ts           - MUI theme configuration
     pageLayout.ts      - Centralized layout and spacing
   ```

### 🚧 In Progress

- Exercise phase integration
- Navigation arrows for NavigationContainer (desktop)
- Results summary implementation

### 📋 Next Steps

1. Complete exercise rotation logic
2. Add progress tracking
3. Implement results summary
4. Add routing with React Router
5. Integrate Gemini API for example sentence generation

## Key Technical Details

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: MUI (Material-UI v6)
- **State Management**: React Context API
- **Mobile**: React Native with Expo (separate app)

### Important Patterns

#### String Normalization (CRITICAL)
All searches MUST be case and accent insensitive:
```typescript
import { compareStrings, stringIncludes } from '@latin-app/shared';

// These return true:
compareStrings("Rosa", "rosa")     // true
compareStrings("María", "MARIA")   // true
stringIncludes("niño", "NINO")    // true
```
**Location**: `/packages/shared/src/utils/stringUtils.ts`

#### Component Props Pattern
```typescript
interface ComponentProps {
  value: SomeType;           // Data to display
  onChange: (val) => void;    // Callback for changes
  disabled?: boolean;         // Optional props
}
```

#### MUI Styling
```javascript
sx={{
  p: 2,                    // padding: 16px (2 * 8px)
  m: 2,                    // margin: 16px
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.paper',
  color: 'text.primary'
}}
```

#### Centralized Layout Configuration
**Location**: `/apps/web/src/config/pageLayout.ts`

This file contains all centralized spacing, padding, and layout configurations:
- **PAGE_PADDING**: Standardized padding values for pages and cards
- **SECTION_SPACING**: Consistent spacing between sections
- **PAGE_CONTAINER**: Container dimensions and heights
- **getPageContainerSx()**: Helper function for page layouts
  - Types: 'fullscreen', 'full', 'card', 'content'
  - Widths: 'compact', 'standard', 'wide'

Example usage:
```typescript
import { getPageContainerSx, PAGE_PADDING, SECTION_SPACING } from '../../../config/pageLayout';

// Full-screen study session
<Box sx={getPageContainerSx('fullscreen', 'standard')}>

// Card container with standard width
<Box sx={getPageContainerSx('card', 'standard')}>

// Using spacing constants
<Box sx={{ mt: SECTION_SPACING.medium, p: PAGE_PADDING.card }}>
```

#### Theme Configuration
**Location**: `/apps/web/src/config/theme.ts`

Dark theme configuration with Material Design 3 colors:
- Primary: Purple (#BB86FC)
- Secondary: Amber (#FFC107)
- Background: Dark (#121212)
- Surface: Elevated (#1E1E1E)

### Data Structure

```typescript
interface NormalizedLatinWord {
  id: string;                    // "word_rosa_0001"
  nominative: string;            // "Rosa"
  genitive: string;              // "rosae"
  declension: '1st' | '2nd' | '3rd' | '4th' | '5th';
  gender: 'masculine' | 'feminine' | 'neuter';
  spanishTranslation: string;
  additionalMeanings: string[];
  exampleSentence?: string;      // For AI generation
}
```

### Declension Color Coding
- 1st: Purple (#BB86FC)
- 2nd: Blue (#03DAC6)
- 3rd: Green (#4CAF50)
- 4th: Orange (#FF9800)
- 5th: Red (#f44336)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev:web

# Build for production
npm run build:web

# Run mobile app
npm run dev:mobile
```

## File Organization Guidelines

1. **Components**: Small, focused, single responsibility
2. **Features**: Complete feature modules with their own components
3. **Global**: Shared across multiple features
4. **Exercises**: Specific to drill/exercise functionality

## UI/UX Requirements

- **Dark Theme Only**: No light theme needed
- **Spanish UI**: All user-facing text in Spanish
- **Mobile First**: Must work on phones
- **Responsive**: Adapt to all screen sizes
- **Accessibility**: Include data-testid attributes

## Future AI Integration Points

### Gemini API Integration
- Generate example sentences for vocabulary
- Create contextual hints during exercises
- Provide pronunciation guidance
- Generate personalized practice content
- Analyze learning patterns for recommendations

### Prompt Examples for Gemini

#### Example Sentence Generation
```
Generate a simple Latin sentence using the word "rosa, rosae" (1st declension, feminine, meaning "rose") 
that demonstrates its grammatical form. Include Spanish translation.
```

#### Exercise Creation
```
Create a multiple choice question testing knowledge of "puella, puellae" (girl). 
Provide 4 options with similar declensions.
```

## Important Notes

1. **No Backend**: Currently using local JSON files
2. **Comments Required**: Extensive comments for learning purposes
3. **MUI Components Only**: No custom CSS
4. **Testing IDs**: All UI elements need data-testid
5. **Error Handling**: User-friendly Spanish error messages

## Project Goals

1. Make Latin learning interactive and engaging
2. Support different learning styles (visual, interactive, repetitive)
3. Track progress and adapt to user level
4. Eventually integrate AI for personalized learning
5. Build a scalable, maintainable codebase

## Contact & Resources

- Repository: [GitHub Link]
- React Docs: https://react.dev
- MUI Components: https://mui.com
- TypeScript: https://www.typescriptlang.org
- Vite: https://vitejs.dev