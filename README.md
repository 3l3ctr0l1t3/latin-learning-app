# Latin Learning Application 📚

An interactive, module-based application for learning Latin through dynamic content and active practice sessions. Built with React, TypeScript, and Material Design.

![Status](https://img.shields.io/badge/status-40%25%20complete-yellow)
![Components](https://img.shields.io/badge/components-11%2F26-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### ✅ Current Features (Working Now!)
- **Component System** - 11 production-ready React components
- **Word Search** - Live search with dropdown and multi-select
- **Smart Selection** - Color-coded chips by declension (1st-5th)
- **Dark Theme** - Beautiful purple & cyan Material Design theme
- **690 Latin Words** - Complete database with full grammatical info
- **Mobile Responsive** - Optimized for all screen sizes
- **Development Tools** - ComponentCanvas and PageCanvas for testing

### 🚧 In Development
- **Study Sessions** - Configuration screen 80% complete
- **Flashcards** - Flip animation and progress tracking
- **Practice Drills** - Multiple choice and fill-in-blank
- **Results Screen** - Performance statistics

### 🔮 Coming Soon
- **AI Examples** - Gemini API integration for sentences
- **Spaced Repetition** - Smart review scheduling
- **User Profiles** - Save progress and preferences
- **Mobile Apps** - Native iOS and Android versions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/latin-learning-app.git
cd latin-learning-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev:web
```

4. Open your browser to http://localhost:5173

## 📁 Project Structure

```
latin2/
├── apps/
│   ├── web/                    # React web application
│   └── mobile/                  # React Native mobile app
├── packages/
│   ├── types/                   # Shared TypeScript definitions
│   ├── data/                    # Data service layer
│   └── shared/                  # Shared utilities
├── scripts/                     # Build and utility scripts
├── vocabulary.json              # Latin words database
└── docs/                        # Documentation
```

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI Library:** Material-UI (MUI) v6
- **Mobile:** React Native, Expo
- **State Management:** React Context API
- **Styling:** Material Design 3, Dark Theme
- **Monorepo:** npm workspaces

## 📖 Documentation

- [CLAUDE.md](./CLAUDE.md) - AI assistant guidelines & coding standards
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current project status & metrics
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap & tasks
- Component documentation inline with extensive comments

## 🎯 Study Session Flow

### Phase 1: Configuration
- Select words to study (filter by declension/gender)
- Choose session duration (5/10/15 minutes)
- Pick drill types

### Phase 2: Flashcards
- View Latin word with grammatical information
- Click to reveal Spanish translation
- Generate AI example sentences

### Phase 3: Drills
- Multiple choice translations
- Fill in the blank exercises
- Direct input practice

## 🎨 Design System

- **Primary Color:** Purple (#BB86FC)
- **Secondary Color:** Cyan (#03DAC6)
- **Background:** Dark Grey (#121212)
- **Surface:** Lighter Grey (#1E1E1E)
- **Typography:** System fonts with Material Design scale

## 📝 Available Scripts

```bash
# Development
npm run dev:web          # Start web dev server
npm run dev:mobile       # Start mobile dev server

# Build
npm run build:web        # Build web app for production

# Data Management
node scripts/normalize-vocabulary.js  # Normalize vocabulary data

# Git
git add .
git commit -m "message"
git push origin main
```

## 🤝 Contributing

This is a learning project, but contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with descriptive messages
4. Push to your branch
5. Open a Pull Request

## 📚 Learning Resources

This project is built with extensive comments to help developers learn:

- **React Concepts:** Components, Props, State, Hooks
- **TypeScript:** Type safety, Interfaces, Generics
- **Material-UI:** Component library, Theming, Responsive design
- **CSS:** Flexbox, Grid, Spacing, Colors

See [LEARNING_NOTES.md](./LEARNING_NOTES.md) for detailed explanations.

## 🐛 Known Issues

- Dropdown flickers on fast typing (minor)
- Mobile keyboard overlap on some devices (minor)
- No loading states for async operations (minor)

## ✅ Recently Fixed
- Dropdown no longer appears when removing selected words
- Responsive design now works properly on all devices
- Mobile shows 3 words with "+X más" indicator

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Vocabulary data sourced from classical Latin texts
- Built with Material Design principles
- Inspired by modern language learning apps

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Note:** This is a learning project in active development. Features and documentation are continuously being improved.