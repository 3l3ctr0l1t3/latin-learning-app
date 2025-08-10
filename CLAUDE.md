# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Current Project State (Last Updated: 2025-08-09)

#### ✅ Completed:
1. **Monorepo Structure** - Set up with npm workspaces
   - `/apps/web` - React SPA with Vite
   - `/apps/mobile` - React Native with Expo
   - `/packages/types` - Shared TypeScript definitions
   - `/packages/data` - Vocabulary data service
   - `/packages/shared` - Shared utilities (to be expanded)

2. **Web App Foundation**
   - Dark theme configured with MUI (Material-UI)
   - Dashboard/Homepage component with stats and quick actions
   - Theme: Dark background (#121212) with purple (#BB86FC) and cyan (#03DAC6) accents

3. **Data Layer**
   - 690 Latin words imported from vocabulary.json
   - Normalized data structure with IDs and consistent types
   - VocabularyService class for filtering, searching, and retrieving words
   - Script to normalize vocabulary data (`scripts/normalize-vocabulary.js`)

4. **Development Environment**
   - Git repository initialized
   - Comprehensive .gitignore configured
   - Dev server runs on http://localhost:5173

#### 🚧 In Progress:
- Study Session feature - Component-based architecture started
- DurationSelector component created

#### 📋 Next Steps:
- Complete Study Session components (see NEXT_STEPS.md)
- Implement routing between pages
- Add state management for session data
- Create flashcard and drill components

## Technical Stack

- **Architecture**: Single Page Application (SPA) + Mobile App
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

# Build web app
npm run build:web
```

## Project Structure

```
latin2/
├── apps/
│   ├── web/                    # React web application
│   │   ├── src/
│   │   │   ├── app/            # App-level components (future: router, providers)
│   │   │   ├── config/         # Configuration (theme.ts)
│   │   │   ├── features/       # Feature-based modules
│   │   │   │   ├── dashboard/  # Homepage
│   │   │   │   └── study-session/ # Study session (in progress)
│   │   │   ├── components/     # Shared components (to be added)
│   │   │   ├── hooks/          # Custom React hooks (to be added)
│   │   │   └── services/       # API services (future)
│   │   └── index.html
│   └── mobile/                  # React Native app
│       └── src/                 # To be structured
├── packages/
│   ├── types/                   # TypeScript type definitions
│   ├── data/                    # Data service layer
│   └── shared/                  # Shared utilities
├── scripts/
│   └── normalize-vocabulary.js  # Data normalization script
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