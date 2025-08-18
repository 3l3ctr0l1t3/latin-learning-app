# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: UI Development Agent Usage

**MANDATORY: For ALL UI-related tasks (creating components, updating components, styling, layout changes), you MUST use the ui-developer agent located at `.claude/agents/ui-developer.md`**

This ensures consistent, learning-focused development with proper comments, MUI-only styling, Spanish UI text, and mobile-responsive design.

## CRITICAL: Learning-Focused Development

**The user is learning web development through this project.** They have:
- Java backend experience 
- Used AngularJS 10 years ago
- Limited knowledge of modern HTML, JavaScript, CSS, and React

### MANDATORY Requirements for ALL Code:
1. **Add extensive comments to ALL code** - Explain what each part does and why
2. **Explain web development concepts** - Define terms like props, state, hooks, components
3. **Clarify CSS terminology** - Explain margins (space outside), padding (space inside), flexbox, etc.
4. **Use correct terminology** - Correct any misused terms and explain the right ones
5. **Think of the user as a beginner** - Don't assume knowledge of React patterns or modern JS
6. **Comment every function, component, and CSS rule** - Explain the purpose and how it works

## CRITICAL: String Search and Comparison Requirements

**ALL searches and comparisons in the application MUST be case-insensitive and accent-insensitive.**

### Mandatory Search/Comparison Rules:
1. **Case Insensitive**: "Rosa", "ROSA", "rosa" must all match
2. **Accent/Tilde Insensitive**: "María" must match "maria", "MARÍA", "Maria"
3. **Diacritic Insensitive**: All diacritical marks must be ignored:
   - Tildes: á→a, é→e, í→i, ó→o, ú→u
   - Dieresis: ü→u
   - Ñ: ñ→n
   - Latin macrons: ā→a, ē→e, ī→i, ō→o, ū→u
4. **Use Centralized Functions**: ALWAYS use the stringUtils functions from `@latin-app/shared`:
   - `normalizeForSearch()` - for normalizing strings
   - `compareStrings()` - for exact comparison
   - `stringIncludes()` - for partial matching
   - `stringStartsWith()` - for prefix matching
   - `fuzzySearchScore()` - for relevance scoring

### Implementation Location:
The string normalization utilities are located in `/packages/shared/src/utils/stringUtils.ts`

### Example Usage:
```javascript
import { compareStrings, stringIncludes } from '@latin-app/shared';

// These all return true:
compareStrings("Rosa", "rosa")     // true
compareStrings("María", "MARIA")   // true
stringIncludes("niño juega", "NINO") // true
```

This is CRITICAL for the Latin learning app as users may:
- Not remember exact capitalization
- Type without accents on their keyboard
- Search in Spanish (with tildes) or Latin (with macrons)

## Project Overview

Latin Learning Application - An interactive, module-based platform for learning Latin through dynamic content and active practice sessions.

### Current Project State (Last Updated: 2025-08-18 - Session 4)

#### ✅ Completed (Updated: 2025-08-18 - Session 4):
1. **Monorepo Structure** - Set up with npm workspaces
   - `/apps/web` - React SPA with Vite
   - `/apps/mobile` - React Native with Expo
   - `/packages/types` - Shared TypeScript definitions
   - `/packages/data` - Vocabulary data service
   - `/packages/shared` - Shared utilities with string normalization functions

2. **Web App Foundation**
   - Dark theme configured with MUI (Material-UI)
   - Dashboard/Homepage component with stats and quick actions
   - Theme: Dark background (#121212) with purple (#BB86FC) and cyan (#03DAC6) accents
   - Navigation system with 3 views: Dashboard, Components Canvas, Pages Canvas
   - Mobile-responsive navigation with drawer menu

3. **Data Layer**
   - 690 Latin words imported from vocabulary.json
   - Normalized data structure with IDs and consistent types
   - VocabularyService class for filtering, searching, and retrieving words
   - Case and accent-insensitive search utilities in shared package
   - Script to normalize vocabulary data (`scripts/normalize-vocabulary.js`)

4. **Study Session Feature** (95% Complete)
   - **Step 1: Word Selection**
     - WordSelectionStep with search, filters, and word cards
     - DeclensionFilter - filter by 1st, 2nd, 3rd, 4th, 5th declension
     - GenderFilter - filter by masculine, feminine, neuter
     - WordSearchBar with debounced search
     - WordSearchDropdown for quick selection
     - SelectedWordsDisplay showing selected words
     - WordCard component showing word details
   - **Step 2: Duration & Drills**
     - DurationSelector (5, 10, 15 minutes)
     - DrillTypeSelector with multiple exercise types
   - **Step 3: Study Session Implementation**
     - StudySession component with timer
     - StudyWordsViewer with swipe/keyboard navigation
     - WordNavigator reusable component
     - SessionTimer with visual progress
     - Three phases: Review → Exercises → Summary
     - Mobile swipe gestures and desktop keyboard arrows
     - Circular navigation through word list
   
5. **Component Library**
   - SelectedWordChip - compact word display with declension colors
   - WordCard - three versions (full, minimal, compact) with declension color coding
   - NavigationContainer - reusable navigation wrapper
   - WordNavigator - swipeable word carousel with dots
   - MultipleChoiceOption - exercise option component
   - SessionTimer - compact timer with progress bar
   - Multiple reusable filter and selector components

6. **UI/UX Improvements**
   - Color-coded Latin text by declension (purple, blue, green, orange, red)
   - Responsive layouts with proper mobile/desktop breakpoints
   - Normalized vertical heights for desktop (md: 600px, lg: 650px, xl: 700px)
   - Theme updates: Secondary color changed from cyan to amber
   - All UI elements have unique data-testid attributes for testing
   - Improved WordCard layout for desktop (grammar info next to word)
   - Subtle outlined buttons with blur effects for optional actions

7. **Development Tools**
   - ComponentCanvas for testing individual components
   - PageCanvas showing the complete study session flow
   - App navigation between different development views
   - Network access configured for mobile testing (port proxy for WSL)

8. **Component Organization** (Session 3)
   - Reorganized components into logical folders:
     - `/components/global/` - Reusable components (WordCard, SessionTimer, etc.)
     - `/components/exercises/` - All exercise and drill components
     - `/features/study-session/components/config/` - Configuration step components
     - `/features/study-session/components/filters/` - Filter components
     - `/features/study-session/components/search/` - Search components
   - Updated all import paths for new structure
   - Build successful with new organization

9. **Progressive Web App (PWA) Support** (Session 4)
   - **Manifest.json** - PWA configuration with app metadata, theme colors, and icon
   - **Service Worker** - Enables offline functionality with cache-first strategy
   - **App Icons** - SVG icon with "LA" branding (scalable to all sizes)
   - **Install Button** - Native install prompt in app header
   - **iOS Support** - Apple-specific meta tags for home screen installation
   - **Offline Capability** - Works without internet after first visit
   - **Full-Screen Mode** - No browser UI when launched from home screen
   - PWA features work on Android, iOS, and desktop browsers

#### 🚧 In Progress:
- Exercise phase implementation (multiple components created, integration pending)
- Navigation arrows for NavigationContainer (md-xl screens)

#### 📋 Immediate Next Steps:
1. **Implement Local Storage** (See `/docs/STORAGE_BACKEND_PLAN.md`):
   - Create LocalStorageService for data persistence
   - Track session progress and results
   - Add statistics to Dashboard
   - Implement auto-save functionality

2. **Complete Exercise Components**:
   - Finish MultipleChoiceExercise implementation
   - Create FillInTheBlankExercise component
   - Create DirectInputExercise component
   - Create exercise manager to rotate between types

3. **Session Flow Completion**:
   - Connect exercises to StudySession
   - Implement exercise rotation logic
   - Add progress tracking within exercises
   - Create results summary with statistics

4. **Polish & Bug Fixes**:
   - Fix any remaining TypeScript errors
   - Test full flow on mobile and desktop
   - Ensure smooth transitions between phases
   - Add loading states where needed

#### 🔄 Future Enhancements:
- Add routing with React Router for proper navigation
- Implement user accounts and progress persistence
- Add spaced repetition algorithm
- Create more exercise types (conjugation, translation)
- Add audio pronunciation
- Implement achievements/gamification
- Enhance offline support with background sync
- Add push notifications for study reminders

## Technical Stack

- **Architecture**: Progressive Web App (PWA) + Mobile App
- **Web Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Mobile Framework**: React Native with Expo
- **UI Components**: 
  - Web: MUI (Material-UI v6) - Material Design 3 components only
  - Mobile: React Native Paper
- **State Management**: React Context API (will add Zustand if needed)
- **Routing**: React Router DOM (to be implemented)
- **AI Integration**: Gemini API (future)
- **Internationalization**: i18next (installed, not configured)
- **PWA Features**:
  - Service Worker for offline support
  - Web App Manifest for installability
  - Cache-first strategy for assets
  - Full-screen capable on mobile

## Development Commands

```bash
# Install dependencies (from root)
npm install

# Run web app
npm run dev:web
# Or directly:
cd apps/web && npm run dev

# Run mobile app  
npm run dev:mobile
# Or directly:
cd apps/mobile && npm start

# Normalize vocabulary data
node scripts/normalize-vocabulary.js

# Build web app (includes PWA assets)
npm run build:web

# Test PWA installation locally
# 1. Run dev server: npm run dev:web
# 2. Open http://localhost:5173/latin-learning-app/
# 3. Look for install button in header or browser prompt
```

## Project Structure

```
latin2/
├── apps/
│   ├── web/                    # React web application (PWA)
│   │   ├── public/             # Static assets
│   │   │   ├── manifest.json   # PWA manifest
│   │   │   ├── service-worker.js # Service worker for offline
│   │   │   └── icon.svg        # App icon
│   │   ├── src/
│   │   │   ├── app/            # App-level components
│   │   │   ├── components/     # Shared components
│   │   │   │   ├── global/     # Globally reusable components
│   │   │   │   └── exercises/  # Exercise/drill components
│   │   │   ├── config/         # Configuration (theme.ts)
│   │   │   ├── contexts/       # React contexts (StudySession)
│   │   │   ├── features/       # Feature-based modules
│   │   │   │   ├── dashboard/  # Dashboard page
│   │   │   │   ├── homepage/   # Homepage
│   │   │   │   ├── component-canvas/ # Component testing
│   │   │   │   ├── page-canvas/      # Page testing
│   │   │   │   └── study-session/    # Study session feature
│   │   │   │       └── components/
│   │   │   │           ├── config/   # Configuration components
│   │   │   │           ├── filters/  # Filter components
│   │   │   │           └── search/   # Search components
│   │   │   ├── hooks/          # Custom React hooks (to be added)
│   │   │   └── services/       # API services (future)
│   │   └── index.html          # Main HTML with PWA meta tags
│   └── mobile/                  # React Native app
│       └── src/                 # To be structured
├── packages/
│   ├── types/                   # TypeScript type definitions
│   ├── data/                    # Data service layer
│   └── shared/                  # Shared utilities
├── scripts/
│   └── normalize-vocabulary.js  # Data normalization script
├── docs/                        # Documentation
│   └── STORAGE_BACKEND_PLAN.md # Local storage & backend roadmap
├── .claude/
│   └── agents/                  # Custom AI agents
│       └── server-build-manager.md # Server management agent
├── vocabulary.json              # Original Latin words data
├── vocabulary-normalized.json   # Processed data with IDs
└── CLAUDE.md                    # This file
```

## Component Development Guidelines

### Component-First Methodology
1. **Build small, focused components first**
   - Each component should have a single responsibility
   - Components should be reusable and not know about larger context
   - Example: DurationSelector only handles duration selection

2. **Component Types:**
   - **Presentational/Dumb Components**: Only display UI, receive props, emit events
   - **Container/Smart Components**: Manage state and business logic
   - **Layout Components**: Handle page structure and composition

3. **Props Pattern:**
   ```typescript
   interface ComponentProps {
     value: SomeType;           // Data to display
     onChange: (val) => void;    // Callback for changes
     disabled?: boolean;         // Optional props with ?
   }
   ```

4. **File Organization:**
   ```
   feature/
   ├── components/
   │   ├── FeatureMain.tsx     # Main container
   │   ├── SubComponent.tsx    # Smaller pieces
   │   └── index.ts           # Barrel export
   ├── hooks/                  # Feature-specific hooks
   ├── types/                  # Feature types
   └── utils/                  # Feature utilities
   ```

## CSS/Styling Guidelines

### MUI sx prop patterns:
```javascript
sx={{
  // Spacing (multiplied by 8px)
  p: 2,      // padding: 16px
  m: 2,      // margin: 16px
  px: 2,     // padding-left and padding-right
  py: 2,     // padding-top and padding-bottom
  mt: 2,     // margin-top
  mb: 2,     // margin-bottom
  
  // Flexbox
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  
  // Sizing
  width: '100%',
  minHeight: 400,
  
  // Colors (use theme colors)
  bgcolor: 'background.paper',
  color: 'text.primary',
}}
```

## Vocabulary Data Structure

```typescript
interface NormalizedLatinWord {
  id: string;                    // e.g., "word_rosa_0001"
  nominative: string;            // e.g., "Rosa"
  genitive: string;              // e.g., "rosae"
  declension: '1st' | '2nd' | '3rd' | '4th' | '5th';
  gender: 'masculine' | 'feminine' | 'neuter';
  spanishTranslation: string;
  additionalMeanings: string[];
  exampleSentence?: string;      // For AI generation
}
```

## Study Session Architecture

### Phase 1: Configuration
- Word selection with filters
- Duration selection (5/10/15 min)
- Drill type selection

### Phase 2: Flashcards
- Show nominative, genitive, declension, gender
- Click to reveal Spanish translation
- "Generate Example" button for AI sentences

### Phase 3: Drills
- Multiple choice (Latin→Spanish, Spanish→Latin)
- Fill in the blank
- Direct input

## Session 4 Key Achievements (2025-08-18)

This session focused on making the app installable as a Progressive Web App (PWA):

1. **PWA Implementation**: Full PWA support with offline capabilities
2. **Service Worker**: Implemented caching strategy for offline functionality
3. **App Manifest**: Created manifest.json with app metadata and branding
4. **Install Flow**: Added native install button with browser prompt integration
5. **Cross-Platform Support**: Works on Android, iOS, and desktop browsers
6. **Icon System**: Created scalable SVG icon with app branding
7. **iOS Optimization**: Added Apple-specific meta tags for home screen
8. **Agent Enhancement**: Updated server-build-manager agent to run servers in background

## Session 3 Key Achievements

This session focused on code organization and preparation for enhanced navigation:

1. **Component Reorganization**: Created logical folder structure separating global, exercise, and feature-specific components
2. **Import Path Updates**: Successfully updated all import paths across 30+ components
3. **Build Verification**: Project builds successfully with new structure
4. **Documentation Update**: Updated CLAUDE.md with current project state

Previous Session (Session 2) Achievements:
1. **Created Complete Study Flow**: Configuration → Word Review → Exercises → Summary
2. **Added Advanced Navigation**: Swipe gestures for mobile, keyboard arrows for desktop
3. **Implemented Session Timer**: Visual countdown with progress bar
4. **Improved Visual Design**: Declension color coding, better layouts, refined buttons
5. **Mobile Optimization**: Full screen usage, responsive breakpoints, touch gestures
6. **Code Organization**: Reusable components (WordNavigator, NavigationContainer)
7. **Testing Infrastructure**: Added data-testid to all UI elements

## Important Implementation Notes

1. **No Backend Yet** - All data comes from local JSON files
2. **No Custom Styling** - Use only MUI components
3. **Mobile Responsive** - All layouts must work on phones
4. **Dark Theme Only** - No light theme switch needed
5. **Spanish UI** - All user-facing text in Spanish
6. **Extensive Comments** - Every component heavily commented

## Common Patterns to Use

### State Management
```javascript
const [value, setValue] = useState(initialValue);
```

### Event Handlers
```javascript
const handleClick = () => {
  // Handle the event
};
```

### Conditional Rendering
```javascript
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

### Array Mapping
```javascript
{items.map(item => (
  <Component key={item.id} {...item} />
))}
```

## Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "feat: add component name"

# Push to GitHub
git push origin main
```

## Troubleshooting

### Common Issues:
1. **Module not found**: Run `npm install` from root
2. **Port already in use**: Kill process on port 5173 or change port in vite.config
3. **TypeScript errors**: Check imports and type definitions
4. **Component not rendering**: Check exports/imports and console for errors

## Resources for Learning

- React Docs: https://react.dev
- MUI Components: https://mui.com/components
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Vite Guide: https://vitejs.dev/guide/
- CSS Flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- Add unique identifiers to each UI element coded, Always ALWAYS
- When creating new components, add them to the start of the component cnavas, not the end
- the user is ALWAY in charge of running the development server