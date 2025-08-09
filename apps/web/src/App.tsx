/**
 * APP COMPONENT - The Root Component of our Application
 * 
 * This is the main component that wraps everything else.
 * Think of it as the <body> of your application.
 * All other components are children of this one.
 */

// Import React
import React from 'react';

// Import Material-UI theme provider components
// ThemeProvider applies our theme to all child components
import { ThemeProvider } from '@mui/material/styles';

// CssBaseline resets browser default styles and applies baseline styles
// It's like CSS reset + normalize.css
import CssBaseline from '@mui/material/CssBaseline';

// Import our custom theme
import { darkTheme } from './config/theme';

// Import our Dashboard component
import Dashboard from './features/dashboard/components/Dashboard';

/**
 * App Component
 * 
 * This is the root of our component tree.
 * Every React app has one root component that contains all others.
 */
function App() {
  // For now, we're just showing the Dashboard
  // Later, we'll add routing to switch between different pages
  
  return (
    // ThemeProvider makes our theme available to all MUI components
    // Any MUI component inside ThemeProvider will use our custom theme
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline does several things:
          1. Removes default margins from <body>
          2. Applies background color from theme
          3. Sets default font from theme
          4. Ensures consistent rendering across browsers */}
      <CssBaseline />
      
      {/* Our actual app content */}
      <Dashboard />
      
      {/* Later, we'll replace the Dashboard with a Router like this:
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/study" element={<StudySession />} />
              <Route path="/vocabulary" element={<VocabularyList />} />
            </Routes>
          </Router>
      */}
    </ThemeProvider>
  );
}

// Export the App component as the default export
// This means when someone imports from './App', they get this component
export default App
