# Next Steps - Development Roadmap 🗺️

## 🔴 Immediate Priority (Current Sprint)

### 1. Complete Study Session Components
Following component-first methodology, create these small components:

#### Basic Components (Build These First!)
```typescript
// Location: apps/web/src/features/study-session/components/

✅ DurationSelector.tsx        // Already created
⬜ DrillTypeSelector.tsx       // Checkboxes for drill types
⬜ WordCard.tsx               // Single word display card
⬜ WordSearchBar.tsx          // Search input with icon
⬜ DeclensionFilter.tsx       // Filter chips for declensions  
⬜ GenderFilter.tsx           // Filter chips for genders
⬜ SelectedWordChip.tsx       // Single selected word with X
```

#### Container Components (After basics are done)
```typescript
⬜ WordSelector.tsx           // Combines search + filters + list
⬜ SessionConfig.tsx          // Combines duration + drills
⬜ SelectedWordsList.tsx      // List of selected word chips
⬜ StudySessionPage.tsx       // Main page that uses all components
```

### 2. Implement Routing
```bash
npm install react-router-dom
```

Create router structure:
```typescript
// apps/web/src/app/Router.tsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/study/config" element={<StudySessionPage />} />
  <Route path="/study/flashcards" element={<FlashcardsPage />} />
  <Route path="/study/drills" element={<DrillsPage />} />
  <Route path="/vocabulary" element={<VocabularyPage />} />
</Routes>
```

## 🟡 Next Sprint (Study Session Implementation)

### 3. Flashcard Components
```typescript
⬜ FlashcardFront.tsx         // Shows Latin word info
⬜ FlashcardBack.tsx          // Shows translation
⬜ FlashcardContainer.tsx     // Handles flip animation
⬜ FlashcardDeck.tsx          // Navigation between cards
⬜ ExampleSentence.tsx        // AI-generated example display
```

### 4. Drill Components
```typescript
⬜ MultipleChoiceQuestion.tsx
⬜ FillInTheBlankQuestion.tsx  
⬜ DirectInputQuestion.tsx
⬜ DrillContainer.tsx
⬜ DrillResults.tsx
⬜ TimerDisplay.tsx
⬜ ScoreDisplay.tsx
```

### 5. State Management
Create React Context for session state:
```typescript
// apps/web/src/contexts/StudySessionContext.tsx
- Selected words
- Session configuration
- Current progress
- Score tracking
```

## 🟢 Future Sprints

### Sprint 3: Vocabulary Browser
```typescript
⬜ VocabularyTable.tsx
⬜ VocabularyFilters.tsx
⬜ WordDetailModal.tsx
⬜ PaginationControls.tsx
```

### Sprint 4: Progress & Statistics
```typescript
⬜ ProgressChart.tsx
⬜ StudyStreakCalendar.tsx
⬜ WordMasteryIndicator.tsx
⬜ SessionHistory.tsx
```

### Sprint 5: Mobile App
- Set up React Native Paper theme
- Adapt components for mobile
- Configure navigation
- Test on iOS/Android

### Sprint 6: AI Integration
- Gemini API setup
- Example sentence generation
- Smart word suggestions
- Difficulty adjustment

### Sprint 7: Internationalization
- Configure i18next
- Extract all strings
- Add English translations
- Language switcher

### Sprint 8: Polish & Optimization
- Performance optimization
- Loading states
- Error boundaries
- Animations

## 📝 Component Creation Checklist

For EACH new component:

1. **Plan the Component**
   - [ ] Define single responsibility
   - [ ] Identify props needed
   - [ ] Determine if it needs state

2. **Create the File**
   ```typescript
   // 1. Imports
   import React from 'react';
   import { Box, Typography } from '@mui/material';
   
   // 2. Props interface with comments
   interface ComponentProps {
     value: string;
     onChange: (value: string) => void;
   }
   
   // 3. Component with extensive comments
   const Component: React.FC<ComponentProps> = ({ value, onChange }) => {
     // Logic here
     return <Box>...</Box>;
   };
   
   // 4. Export
   export default Component;
   ```

3. **Test the Component**
   - [ ] Create in isolation first
   - [ ] Test with different props
   - [ ] Check responsiveness

4. **Integrate**
   - [ ] Import into parent
   - [ ] Wire up props
   - [ ] Test integration

## 🎯 Definition of Done

A feature is complete when:
- ✅ All components have extensive comments
- ✅ TypeScript types are defined
- ✅ Responsive on mobile/tablet/desktop  
- ✅ Follows Material Design guidelines
- ✅ Spanish text is used
- ✅ Dark theme compatible
- ✅ No console errors
- ✅ Committed to Git

## 💡 Quick Component Templates

### Presentational Component Template
```typescript
import React from 'react';
import { Box, Typography } from '@mui/material';

interface ComponentNameProps {
  // Props here
}

const ComponentName: React.FC<ComponentNameProps> = (props) => {
  return (
    <Box>
      <Typography>Content</Typography>
    </Box>
  );
};

export default ComponentName;
```

### Container Component Template
```typescript
import React, { useState } from 'react';
import { Box } from '@mui/material';

const ContainerName: React.FC = () => {
  const [state, setState] = useState();
  
  const handleChange = () => {
    // Handle change
  };
  
  return (
    <Box>
      {/* Child components */}
    </Box>
  );
};

export default ContainerName;
```

## 🚀 Daily Development Flow

1. **Start Dev Server**
   ```bash
   cd latin2
   npm run dev:web
   ```

2. **Pick a Component** from the immediate priority list

3. **Create Component** following the template

4. **Test Component** in browser

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add ComponentName"
   git push
   ```

## 📌 Important Notes

- **Component-First**: Always build small components before assembling
- **No Custom CSS**: Use only MUI sx prop
- **Comments**: Every component needs learning comments
- **Spanish UI**: All user text in Spanish
- **Git Commits**: Commit after each component

## 🆘 When Stuck

1. Check MUI documentation: https://mui.com/components
2. Review existing components for patterns
3. Check LEARNING_NOTES.md for concepts
4. Use extensive comments to understand code
5. Test in isolation before integrating

---

Remember: Build small, test often, commit frequently! 🚀