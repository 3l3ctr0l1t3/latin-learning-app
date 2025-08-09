# Architecture Documentation 🏗️

This document outlines the technical architecture decisions, patterns, and rationale for the Latin Learning Application.

## 🎯 Architecture Goals

1. **Maintainability** - Easy to understand, modify, and extend
2. **Code Reusability** - Share code between web and mobile
3. **Developer Learning** - Clear patterns for educational purposes
4. **Scalability** - Can grow from MVP to full-featured app
5. **Performance** - Fast load times and responsive UI

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface Layer                     │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │   Web App (React)│              │Mobile App (RN)   │     │
│  └──────────────────┘              └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Shared Business Logic                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Types     │  │     Data      │  │   Utilities   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        Data Storage                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Local JSON  │  │Local Storage  │  │   Future DB   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Monorepo Architecture

### Why Monorepo?

**Benefits:**
- **Code Sharing** - Types, utilities, and business logic shared between platforms
- **Atomic Changes** - Single commit can update web, mobile, and shared code
- **Consistent Tooling** - Same build tools, linters, formatters across projects
- **Simplified Dependencies** - One package.json at root manages everything

**Trade-offs:**
- More complex initial setup
- Requires understanding of workspaces
- Can become unwieldy for very large teams

### Structure:
```
latin2/                          # Root monorepo
├── apps/                        # Applications
│   ├── web/                    # React SPA
│   └── mobile/                  # React Native app
├── packages/                    # Shared packages
│   ├── types/                   # TypeScript definitions
│   ├── data/                    # Data services
│   └── shared/                  # Utilities
└── scripts/                     # Build/maintenance scripts
```

## 🏗️ Component Architecture

### Component-First Methodology

We follow a **component-first** approach where:

1. **Small Components First**
   ```typescript
   // Start with atomic components
   Button → Card → Form → Page
   ```

2. **Single Responsibility**
   ```typescript
   // Each component does ONE thing
   DurationSelector - ONLY selects duration
   WordCard - ONLY displays a word
   SearchBar - ONLY handles search input
   ```

3. **Composition Over Inheritance**
   ```typescript
   // Build complex UIs by combining simple components
   <StudySession>
     <DurationSelector />
     <WordSelector />
     <DrillTypeSelector />
   </StudySession>
   ```

### Component Types

#### 1. Presentational Components (Dumb)
```typescript
// Only concerned with how things look
// Receive data via props
// Don't have their own state (usually)
// Example: WordCard, Button, Badge

const WordCard = ({ word, onFlip }) => (
  <Card onClick={onFlip}>
    <Typography>{word.nominative}</Typography>
  </Card>
);
```

#### 2. Container Components (Smart)
```typescript
// Concerned with how things work
// Manage state and business logic
// Pass data to presentational components
// Example: StudySessionContainer

const StudySessionContainer = () => {
  const [words, setWords] = useState([]);
  const [duration, setDuration] = useState(10);
  
  // Business logic here
  
  return (
    <DurationSelector 
      value={duration} 
      onChange={setDuration} 
    />
  );
};
```

#### 3. Layout Components
```typescript
// Define page structure
// Handle responsive layouts
// Example: PageLayout, Sidebar

const PageLayout = ({ children, sidebar }) => (
  <Grid container>
    <Grid item xs={12} md={3}>{sidebar}</Grid>
    <Grid item xs={12} md={9}>{children}</Grid>
  </Grid>
);
```

## 🎨 Styling Architecture

### Material Design 3 + MUI

**Why MUI?**
- Complete component library
- Built-in dark theme support
- Consistent design language
- Extensive documentation
- Good TypeScript support

**Styling Approach:**
```javascript
// 1. Theme configuration (centralized)
const theme = createTheme({
  palette: { mode: 'dark' }
});

// 2. Component styling (sx prop)
<Box sx={{ p: 2, bgcolor: 'background.paper' }}>

// 3. NO custom CSS files
// Everything through MUI's sx prop
```

### Spacing System
```javascript
// MUI uses 8px base unit
spacing(1) = 8px
spacing(2) = 16px
spacing(3) = 24px
// Used consistently via sx prop
sx={{ p: 2 }} // padding: 16px
```

## 📊 State Management Architecture

### Current: Prop Drilling + Context
```
App
├── Context Provider (Session State)
│   ├── Page Component
│   │   ├── Container Component (local state)
│   │   │   ├── Presentational Component
│   │   │   └── Presentational Component
```

### Why This Approach?
- **Learning Friendly** - Easy to understand data flow
- **Debugging** - Clear prop chains
- **No Magic** - Explicit data passing

### Future Considerations:
- **Redux Toolkit** - If state becomes very complex
- **Zustand** - Simpler alternative to Redux
- **TanStack Query** - For server state management

## 🔀 Routing Architecture

### Client-Side Routing (React Router)
```typescript
// Declarative routing
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/study/*" element={<StudyRoutes />} />
  <Route path="/vocabulary" element={<Vocabulary />} />
</Routes>
```

### Route Organization:
```
/                         # Dashboard
/study/
  /config                # Session configuration
  /flashcards           # Flashcard practice
  /drills               # Drill exercises
  /results              # Session results
/vocabulary              # Browse all words
/progress               # User statistics
```

## 📁 File Organization Patterns

### Feature-Based Structure
```
features/
├── study-session/          # Feature module
│   ├── components/         # Feature components
│   │   ├── DurationSelector.tsx
│   │   ├── WordSelector.tsx
│   │   └── index.ts       # Barrel export
│   ├── hooks/             # Feature hooks
│   │   └── useSessionTimer.ts
│   ├── services/          # Feature services
│   │   └── sessionService.ts
│   └── types/             # Feature types
│       └── session.types.ts
```

### Why Feature-Based?
- **Cohesion** - Related code stays together
- **Scalability** - Easy to add new features
- **Maintainability** - Clear boundaries
- **Deletability** - Easy to remove features

## 🔄 Data Flow Architecture

### Unidirectional Data Flow
```
User Action → Event Handler → State Update → Re-render → UI Update
     ↑                                                        ↓
     └────────────────── User sees change ←─────────────────┘
```

### Data Flow Patterns:

#### 1. Props Down, Events Up
```typescript
// Parent passes data down
<Child data={parentData} onUpdate={handleUpdate} />

// Child sends events up
const Child = ({ data, onUpdate }) => {
  const handleClick = () => onUpdate(newData);
};
```

#### 2. Context for Cross-Cutting Concerns
```typescript
// Theme, auth, user preferences
<ThemeProvider theme={darkTheme}>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

## 🏭 Build Architecture

### Development Build
```
Vite Dev Server
├── Hot Module Replacement (HMR)
├── TypeScript compilation
├── Fast refresh
└── Source maps
```

### Production Build
```
Vite Build
├── Minification
├── Tree shaking
├── Code splitting
├── Asset optimization
└── Bundle analysis
```

## 🔒 Security Architecture

### Current Security Measures:
1. **No Backend** - All data local, no API vulnerabilities
2. **No Authentication** - No user data to protect (yet)
3. **Content Security Policy** - Via Vite defaults
4. **Dependency Scanning** - npm audit

### Future Security Considerations:
- JWT authentication
- API rate limiting
- Input sanitization
- XSS protection
- CORS configuration

## 📱 Mobile Architecture Decisions

### React Native + Expo

**Why React Native?**
- Code sharing with web
- Single language (TypeScript)
- Large ecosystem
- Good performance

**Why Expo?**
- Simplified development
- Built-in features
- Easy deployment
- Good for learning

### Platform-Specific Code:
```typescript
// Shared component interface
interface ButtonProps {
  title: string;
  onPress: () => void;
}

// Web implementation
const WebButton: FC<ButtonProps> = ({ title, onPress }) => (
  <MuiButton onClick={onPress}>{title}</MuiButton>
);

// Mobile implementation  
const MobileButton: FC<ButtonProps> = ({ title, onPress }) => (
  <PaperButton onPress={onPress}>{title}</PaperButton>
);
```

## 🚀 Performance Architecture

### Current Optimizations:
1. **Lazy Loading** - Routes loaded on demand
2. **Code Splitting** - Separate bundles per route
3. **Memoization** - React.memo for expensive components
4. **Virtual Lists** - For large word lists (planned)

### Performance Patterns:
```typescript
// Memoize expensive computations
const filteredWords = useMemo(
  () => words.filter(complexFilter),
  [words, filterCriteria]
);

// Prevent unnecessary re-renders
const WordCard = React.memo(({ word }) => {
  // Component only re-renders if word changes
});

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## 🧪 Testing Architecture (Future)

### Testing Pyramid:
```
        /\
       /E2E\      Few E2E tests (Cypress)
      /------\
     /Integr. \   Some integration tests
    /----------\
   /   Unit     \ Many unit tests (Vitest)
  /--------------\
```

### Testing Strategy:
- **Unit Tests** - Business logic, utilities
- **Component Tests** - React Testing Library
- **Integration Tests** - Feature workflows
- **E2E Tests** - Critical user paths

## 📈 Scalability Considerations

### Current Scale:
- 690 words in memory
- Single user
- Local storage only
- No backend

### Future Scale Planning:
1. **Database** - When >10,000 words
2. **Backend API** - For multi-user support
3. **Caching** - Redis for session data
4. **CDN** - For static assets
5. **PWA** - Offline support

## 🔄 Migration Paths

### From Local to Cloud:
```
Current: JSON files → Local Storage
Step 1:  JSON files → IndexedDB
Step 2:  IndexedDB  → REST API + PostgreSQL
Step 3:  REST API   → GraphQL
```

### From Monolith to Microservices:
```
Current: Single codebase
Future:  - Auth Service
         - Vocabulary Service
         - AI Service (Gemini)
         - Analytics Service
```

## 🎯 Decision Log

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Monorepo | Code sharing, consistency | Complex setup |
| React + TypeScript | Type safety, modern | Learning curve |
| MUI | Complete components | Large bundle |
| Component-first | Maintainability | More files |
| No backend initially | Faster development | Limited features |
| Dark theme only | Simpler | Less flexibility |
| Spanish UI | Target audience | Limited reach |

## 📚 Architecture Principles

1. **KISS** - Keep It Simple, Stupid
2. **DRY** - Don't Repeat Yourself
3. **YAGNI** - You Aren't Gonna Need It
4. **SOLID** - Single responsibility, Open/closed, etc.
5. **Composition > Inheritance**
6. **Explicit > Implicit**
7. **Convention > Configuration**

## 🔮 Future Architecture Evolution

### Phase 1 (Current): MVP
- Local data
- Single user
- Basic features

### Phase 2: Enhanced
- User accounts
- Cloud storage
- AI integration

### Phase 3: Scale
- Multiple languages
- Social features
- Analytics

### Phase 4: Platform
- API for third parties
- Marketplace
- Custom content

---

This architecture is designed to evolve. Start simple, add complexity only when needed. 🚀