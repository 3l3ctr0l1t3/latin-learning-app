# Latin Learning Application 📚

An interactive, module-based application for learning Latin through dynamic content and active practice sessions. Built with React, React Native, and Material Design.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Current Features
- **Dark Theme Interface** - Easy on the eyes during study sessions
- **Dashboard** - Track your progress with statistics
- **690 Latin Words** - Complete vocabulary database with declensions and genders
- **Responsive Design** - Works on desktop, tablet, and mobile

### Coming Soon
- **Study Sessions** - Customizable practice sessions with flashcards
- **Interactive Drills** - Multiple choice, fill-in-the-blank, and direct input exercises
- **AI-Generated Examples** - Context sentences using Gemini API
- **Progress Tracking** - Detailed statistics and study streaks
- **Mobile App** - Native iOS and Android apps

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

- [CLAUDE.md](./CLAUDE.md) - Development guidelines for AI assistance
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap
- [LEARNING_NOTES.md](./LEARNING_NOTES.md) - Web development concepts explained
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture decisions

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

- Mobile app not yet functional
- Routing not implemented
- AI integration pending
- Some gender values in vocabulary need normalization

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