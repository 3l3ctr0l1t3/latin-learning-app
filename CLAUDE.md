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

## Project Overview

This is a Latin Learning Application designed as an interactive, module-based platform for learning Latin through dynamic content and active practice sessions.

## Technical Stack

- **Architecture**: Single Page Application (SPA)
- **Web Framework**: React.js (use Vite for initial setup)
- **Mobile Framework**: React Native
- **UI Components**: 
  - Web: MUI (Material-UI) - Material Design 3 components only
  - Mobile: React Native Paper
- **State Management**: React Context API (consider Zustand if complexity grows)
- **AI Integration**: Gemini API for dynamic content generation
- **Internationalization**: Support for multiple languages (Spanish as initial target)

## Development Approach

**Component-First Methodology**: Always develop and test individual components before assembling screens. Each component should be:
1. Defined independently
2. Coded as a reusable module
3. Tested in isolation

## UI/UX Requirements

- **Theme**: Dark theme by default (#121212 background)
- **Color Scheme**:
  - Primary (high-emphasis): Purple
  - Secondary (medium-emphasis): Blue
  - Text/Icons: Light grey/off-white for contrast
- **Layout**: Fully responsive, viewport-contained without main page scrolling
- **Scrolling**: Internal components become independently scrollable when content exceeds predetermined height

## Core Module: Study Session

The application centers around a three-phase study session:

1. **Configuration Screen**:
   - Word selection via filterable dropdown
   - Session duration selection (5/10/15 minutes)
   - Drill type selection using Filter Chips

2. **Study Phase (Flashcards)**:
   - Two-step reveal: Latin grammatical info → Spanish translation
   - Gemini API integration for example sentence generation
   - Non-flipping cards (click to reveal translation)

3. **Exercise Phase**:
   - Timed drills with instant feedback
   - Multiple exercise types (Multiple Choice, Fill-in-the-Blank, Direct Input)

## Development Commands

Since this is a new project, initialize with:

```bash
# For React (Vite) setup
npm create vite@latest . -- --template react
npm install

# Essential dependencies to install
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom
npm install i18next react-i18next

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Project Structure

Recommended directory structure:
```
src/
  components/     # Reusable UI components
  screens/        # Full screen views
  contexts/       # React Context providers
  services/       # API integrations (Gemini)
  utils/          # Helper functions
  i18n/          # Internationalization files
  data/          # Vocabulary database
```

## Key Implementation Notes

- No custom-styled interactive components - use Material Design 3 exclusively
- All user-facing text must be i18n-ready
- Vocabulary data structure should include: Nominative, Genitive, Declension, Gender, Spanish translation
- Session state should track: selected words, duration, drill types, progress, scores