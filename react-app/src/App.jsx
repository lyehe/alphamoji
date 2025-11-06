/**
 * App Component - Root of the Application
 *
 * WHAT: The top-level component that wraps the entire app
 *
 * WHY: Every React app has a root component that:
 * - Provides global context
 * - Sets up routing (if needed)
 * - Wraps app in providers
 * - Renders main components
 *
 * LEARNING NOTES:
 * - This is where Context Providers wrap the app
 * - Simple structure for this app (no routing needed)
 * - In larger apps, you'd add React Router here
 */

import React from 'react';
import { GameProvider } from './context/GameContext';
import GameContainer from './components/Game/GameContainer';
import HistoryModal from './components/Modals/HistoryModal';
import StatsModal from './components/Modals/StatsModal';
import './App.css';

/**
 * App Component
 *
 * LEARNING: Component hierarchy:
 * App (provides context)
 * └── GameProvider (provides game state to all children)
 *     ├── GameContainer (main game)
 *     ├── HistoryModal (history popup)
 *     └── StatsModal (stats popup)
 *
 * Why this structure?
 * - GameProvider at top makes game state available everywhere
 * - Modals at same level as GameContainer (they overlay everything)
 * - Clean, simple hierarchy
 */
function App() {
  return (
    /**
     * LEARNING: GameProvider wraps everything
     * Any component inside can use useGameContext() to access game state
     *
     * This is the "Provider" part of Context API pattern!
     */
    <GameProvider>
      {/* LEARNING: Fragment syntax <> ... </> */}
      {/* Wraps multiple elements without adding extra DOM node */}
      {/* Alternative: <React.Fragment> ... </React.Fragment> */}
      <>
        {/* Main game interface */}
        <GameContainer />

        {/* Modals - only visible when opened */}
        <HistoryModal />
        <StatsModal />
      </>
    </GameProvider>
  );
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Root Component**
 *    - Every React app has a root component
 *    - Usually called App
 *    - Rendered into DOM by main.jsx
 *
 * 2. **Provider Pattern**
 *    - Wrap app in Provider components
 *    - Makes data available to all children
 *    - Can have multiple providers (stack them)
 *
 * 3. **Component Composition**
 *    - Build complex app from simple components
 *    - Each component has clear responsibility
 *    - Easy to understand and maintain
 *
 * 4. **Fragments**
 *    - <> ... </> or <React.Fragment>
 *    - Groups elements without extra DOM node
 *    - React components must return single element
 *    - Fragment lets you return multiple elements
 *
 * App Structure Patterns:
 *
 * Simple App (like this):
 * ```jsx
 * <Provider>
 *   <MainComponent />
 *   <Modals />
 * </Provider>
 * ```
 *
 * App with Routing:
 * ```jsx
 * <Provider>
 *   <Router>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/game" element={<Game />} />
 *   </Router>
 * </Provider>
 * ```
 *
 * App with Multiple Providers:
 * ```jsx
 * <ThemeProvider>
 *   <AuthProvider>
 *     <GameProvider>
 *       <App />
 *     </GameProvider>
 *   </AuthProvider>
 * </ThemeProvider>
 * ```
 *
 * Why Keep It Simple?
 * - This app doesn't need routing (single page)
 * - One context provider is enough
 * - Modals controlled by context state
 * - Easy to understand for beginners
 *
 * When to Add Complexity:
 * - Multiple pages → Add React Router
 * - Authentication → Add Auth context
 * - Themes → Add Theme context
 * - API state → Add React Query
 *
 * Don't over-engineer!
 * - Start simple (like this)
 * - Add complexity when needed
 * - This structure works for most small apps
 *
 * Try This:
 * - Add a theme provider for dark/light mode
 * - Add React Router for multiple pages
 * - Add error boundary for error handling
 * - Add analytics tracking
 *
 * Common Patterns:
 * ✅ Providers at the top
 * ✅ Main content in the middle
 * ✅ Modals/dialogs at the end
 * ✅ Keep App.jsx simple and clean
 *
 * Best Practices:
 * - One Provider component per concern
 * - Keep App.jsx focused on structure, not logic
 * - Use composition over complex nesting
 * - Import global styles here
 */

export default App;
