/**
 * GameContext - Global State Management
 *
 * WHAT: Provides game state to all components without prop drilling
 *
 * WHY: Imagine passing props through 5 levels of components:
 * App → Layout → Page → Section → Component → ActualNeedingComponent
 * That's called "prop drilling" and it's annoying!
 *
 * Context API solves this by providing a "global store" that any component
 * can access directly.
 *
 * LEARNING NOTES:
 * - Context API is React's built-in state management solution
 * - Simpler than Redux for small/medium apps
 * - Perfect for learning React concepts
 * - Two parts: Provider (gives data) and Consumer (uses data)
 */

import React, { createContext, useContext, useState } from 'react';
import useGameState from '../hooks/useGameState';
import useAudio from '../hooks/useAudio';
import useTimer from '../hooks/useTimer';

/**
 * STEP 1: Create the Context
 *
 * LEARNING: createContext creates a "container" for our data
 * Think of it like creating a empty box that we'll fill later
 *
 * The undefined is the default value (we'll provide real value in Provider)
 */
const GameContext = createContext(undefined);

/**
 * STEP 2: Create the Provider Component
 *
 * WHAT: This component "provides" game state to all children
 *
 * HOW IT WORKS:
 * 1. Use our custom hooks to get game state, audio, timer
 * 2. Combine them into one big object
 * 3. Pass that object to all children via Context.Provider
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 *
 * LEARNING NOTES:
 * - {children} is a special prop containing components inside this component
 * - We wrap our hooks here so they're available everywhere
 * - Any component inside <GameProvider> can access this data
 */
export function GameProvider({ children }) {
  // ======================================================================
  // HOOKS - Getting all our game functionality
  // ======================================================================

  /**
   * LEARNING: We call our custom hooks here
   * This gives us all the game logic in one place
   */
  const gameState = useGameState();
  const audio = useAudio();
  const timer = useTimer();

  // ======================================================================
  // UI STATE - Things not related to game logic
  // ======================================================================

  /**
   * LEARNING: Some state is only for UI (showing/hiding modals)
   * We manage it here instead of in game logic
   */

  // Modal visibility
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // UI Settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentFont, setCurrentFont] = useState('fredoka'); // 'fredoka' or 'schoolbell'
  const [isUpperCase, setIsUpperCase] = useState(true); // Show letters in uppercase?

  // ======================================================================
  // UI CONTROL FUNCTIONS
  // ======================================================================

  /**
   * Toggle functions for UI settings
   *
   * LEARNING: These are simple state toggles
   * We include them in context so any component can toggle settings
   */

  const toggleHistoryModal = () => {
    setIsHistoryModalOpen((prev) => !prev);
    // LEARNING: (prev) => !prev is a common pattern
    // It's safer than setX(!x) because it uses the most recent state
  };

  const toggleStatsModal = () => {
    setIsStatsModalOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleFont = () => {
    setCurrentFont((prev) => (prev === 'fredoka' ? 'schoolbell' : 'fredoka'));
    // LEARNING: Ternary operator for toggling between two values
  };

  const toggleCase = () => {
    setIsUpperCase((prev) => !prev);
  };

  // ======================================================================
  // COMBINED VALUE OBJECT
  // ======================================================================

  /**
   * LEARNING: We combine everything into one object
   * This is what all components will receive when they use useGameContext()
   *
   * We use object spreading (...) to include all properties from our hooks
   */
  const value = {
    // Game State (from useGameState hook)
    ...gameState,

    // Audio (from useAudio hook)
    ...audio,

    // Timer (from useTimer hook)
    ...timer,

    // UI State
    isHistoryModalOpen,
    isStatsModalOpen,
    isDarkMode,
    currentFont,
    isUpperCase,

    // UI Actions
    toggleHistoryModal,
    toggleStatsModal,
    toggleDarkMode,
    toggleFont,
    toggleCase,
  };

  /**
   * LEARNING: GameContext.Provider is how we "provide" the value
   * Any component inside <GameProvider> can access this value
   *
   * The {children} renders whatever components are inside GameProvider
   */
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * STEP 3: Create a Custom Hook to Use the Context
 *
 * WHAT: Makes it easier to access our context
 *
 * WHY: Instead of writing useContext(GameContext) everywhere,
 * we write useGameContext() - shorter and clearer!
 *
 * BONUS: We add error checking to catch mistakes
 *
 * @returns {Object} All game state and functions
 *
 * EXAMPLE USAGE:
 * ```jsx
 * function MyComponent() {
 *   const { currentLetter, playCorrectSound } = useGameContext();
 *
 *   return <div>{currentLetter?.letter}</div>;
 * }
 * ```
 */
export function useGameContext() {
  // Get the context value
  const context = useContext(GameContext);

  // LEARNING: Error checking!
  // If someone uses useGameContext outside of <GameProvider>,
  // we show a helpful error message instead of a confusing crash
  if (context === undefined) {
    throw new Error(
      'useGameContext must be used within a GameProvider. ' +
        'Make sure your component is wrapped in <GameProvider>...</GameProvider>'
    );
  }

  return context;
}

/**
 * LEARNING SUMMARY:
 *
 * How Context API Works:
 *
 * 1. **Create Context**: createContext() makes a container
 * 2. **Provide Value**: <Context.Provider value={...}> fills the container
 * 3. **Consume Value**: useContext(Context) gets the value anywhere
 *
 * In this file:
 * - GameContext: The context container
 * - GameProvider: Provides the value (wraps our app)
 * - useGameContext: Custom hook to easily access the value
 *
 * How to Use:
 *
 * ```jsx
 * // In main.jsx or App.jsx:
 * import { GameProvider } from './context/GameContext';
 *
 * function App() {
 *   return (
 *     <GameProvider>
 *       <YourApp />
 *     </GameProvider>
 *   );
 * }
 *
 * // In any component:
 * import { useGameContext } from './context/GameContext';
 *
 * function AnyComponent() {
 *   const { currentLetter, playCorrectSound } = useGameContext();
 *   // Now you have access to game state!
 * }
 * ```
 *
 * Key Concepts:
 *
 * 1. **Provider Pattern**
 *    - One component (Provider) manages state
 *    - Child components consume that state
 *    - No prop drilling needed!
 *
 * 2. **Object Spreading**
 *    - {...gameState} includes all properties from gameState
 *    - Cleaner than writing each property individually
 *
 * 3. **Custom Hook for Context**
 *    - useGameContext() is cleaner than useContext(GameContext)
 *    - Adds error checking for better debugging
 *    - Single source of truth for accessing context
 *
 * 4. **Combining Multiple Hooks**
 *    - GameProvider uses multiple custom hooks
 *    - Combines them into one unified context
 *    - Components don't need to know about individual hooks
 *
 * Benefits:
 * ✅ No prop drilling
 * ✅ Centralized state management
 * ✅ Any component can access game state
 * ✅ Easy to add new state or functions
 * ✅ Built into React (no extra library)
 *
 * Drawbacks:
 * ⚠️ All consumers re-render when context changes
 * ⚠️ Can be overused (not everything needs to be global)
 * ⚠️ Testing requires wrapping in Provider
 *
 * When to Use Context:
 * - Theme (dark mode, colors)
 * - User authentication
 * - Game state
 * - Language/localization
 * - Shopping cart
 *
 * When NOT to Use Context:
 * - State only used in one component (use useState)
 * - State only shared between parent and direct child (use props)
 * - Frequently changing data that causes many re-renders (consider other solutions)
 *
 * Alternative Solutions:
 * - Props: For parent-child communication
 * - Redux: For complex apps with lots of state
 * - Zustand: Simpler alternative to Redux
 * - Jotai/Recoil: Atomic state management
 *
 * Try This:
 * - Add console.log in GameProvider to see when it renders
 * - Add a new piece of state (like score)
 * - Create a second context for user settings
 * - Experiment with React.memo to prevent unnecessary re-renders
 *
 * Debugging Tips:
 * - Use React DevTools to see Context value
 * - Add console.log in Provider to see value changes
 * - Check component tree to ensure Provider wraps consumers
 * - Error "useGameContext must be used within GameProvider" means missing Provider
 */

// Export the context itself (rarely needed, but available)
export { GameContext };
