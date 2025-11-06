/**
 * ControlButtons Component
 *
 * WHAT: Displays control buttons for game settings and features
 *
 * WHY: Users need to control music, view stats, change appearance, etc.
 * This component groups all control buttons in one place
 *
 * LEARNING NOTES:
 * - Demonstrates event handling in React
 * - Shows how to use Context to access global state
 * - Example of a "container component" (has logic and UI)
 * - Introduces button state (active/inactive)
 */

import React from 'react';
import { useGameContext } from '../../context/GameContext';
import styles from './ControlButtons.module.css';

/**
 * ControlButtons Component
 *
 * LEARNING NOTES:
 * - No props! This component gets everything from Context
 * - Demonstrates how Context eliminates prop drilling
 * - Compare this to passing 10+ props from parent!
 *
 * EXAMPLE USAGE:
 * ```jsx
 * // That's it! No props needed.
 * <ControlButtons />
 * ```
 */
function ControlButtons() {
  /**
   * LEARNING: Getting data from Context
   * Instead of receiving props, we pull data from global context
   * This component can access anything in GameContext!
   */
  const {
    // State - for showing button states (active/inactive)
    isMusicPlaying,
    isMuted,
    isDarkMode,
    currentFont,
    isUpperCase,

    // Actions - functions to call when buttons are clicked
    toggleBackgroundMusic,
    toggleMute,
    toggleDarkMode,
    toggleFont,
    toggleCase,
    toggleHistoryModal,
    toggleStatsModal,
  } = useGameContext();

  /**
   * LEARNING: Button configuration array
   * We define all buttons in an array of objects
   * Then map over it to render them - DRY principle!
   *
   * DRY = Don't Repeat Yourself
   * Instead of writing 7 similar button components,
   * we define data and render in a loop
   */
  const buttons = [
    {
      id: 'music',
      label: isMusicPlaying ? '🎵 Music' : '🔇 Music',
      onClick: toggleBackgroundMusic,
      isActive: isMusicPlaying,
      ariaLabel: `${isMusicPlaying ? 'Pause' : 'Play'} background music`,
      disabled: isMuted, // Can't play music when muted
    },
    {
      id: 'mute',
      label: isMuted ? '🔇 Unmute' : '🔊 Sound',
      onClick: toggleMute,
      isActive: !isMuted, // Active when NOT muted
      ariaLabel: isMuted ? 'Unmute all sounds' : 'Mute all sounds',
    },
    {
      id: 'darkMode',
      label: isDarkMode ? '☀️ Light' : '🌙 Dark',
      onClick: toggleDarkMode,
      isActive: isDarkMode,
      ariaLabel: `Switch to ${isDarkMode ? 'light' : 'dark'} mode`,
    },
    {
      id: 'font',
      label: currentFont === 'fredoka' ? '🅰️ Font' : '✏️ Font',
      onClick: toggleFont,
      isActive: currentFont === 'schoolbell',
      ariaLabel: `Switch to ${currentFont === 'fredoka' ? 'handwriting' : 'print'} font`,
    },
    {
      id: 'case',
      label: isUpperCase ? 'Aa Case' : 'AA Case',
      onClick: toggleCase,
      isActive: isUpperCase,
      ariaLabel: `Switch to ${isUpperCase ? 'lowercase' : 'uppercase'} letters`,
    },
    {
      id: 'history',
      label: '📜 History',
      onClick: toggleHistoryModal,
      isActive: false, // History modal state not shown on button
      ariaLabel: 'View game history',
    },
    {
      id: 'stats',
      label: '📊 Stats',
      onClick: toggleStatsModal,
      isActive: false,
      ariaLabel: 'View game statistics',
    },
  ];

  /**
   * LEARNING: Render the component
   * We map over the buttons array to create button elements
   * This is a common React pattern!
   */
  return (
    <div className={styles.controlPanel} role="toolbar" aria-label="Game controls">
      {/**
       * LEARNING: role="toolbar" for accessibility
       * Tells screen readers this is a group of related controls
       */}

      {/* LEARNING: Array.map() to render multiple similar elements */}
      {buttons.map((button) => (
        <button
          key={button.id} // LEARNING: key is required for lists in React!
          className={`${styles.button} ${button.isActive ? styles.active : ''} ${
            button.disabled ? styles.disabled : ''
          }`}
          onClick={button.onClick}
          disabled={button.disabled}
          aria-label={button.ariaLabel}
          /**
           * LEARNING: aria-pressed for toggle buttons
           * Tells screen readers if button is in pressed/unpressed state
           * Important for toggle buttons like mute/unmute
           */
          aria-pressed={button.isActive}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Using Context**
 *    - useGameContext() gives us access to global state
 *    - No props needed! Cleaner component API
 *    - Can access anything in GameContext
 *
 * 2. **Event Handling in React**
 *    - onClick={functionName} - Pass function reference
 *    - NOT: onClick={function()} - This calls immediately!
 *    - NOT: onClick="function()" - React uses JSX, not HTML strings
 *
 * 3. **Data-Driven Rendering**
 *    - Define data in an array (buttons)
 *    - Map over array to render components
 *    - DRY principle - Don't Repeat Yourself
 *    - Easy to add/remove/modify buttons
 *
 * 4. **Array.map() for Lists**
 *    - Common pattern in React
 *    - Transform data into JSX elements
 *    - MUST include key prop (React needs it for optimization)
 *    - key should be unique and stable (use id, not index)
 *
 * 5. **Keys in Lists**
 *    - React uses keys to track which items changed
 *    - Important for performance and avoiding bugs
 *    - Must be unique among siblings
 *    - Should be stable (don't use Math.random()!)
 *    - Good: key={button.id}
 *    - Okay for static lists: key={index}
 *    - Bad: key={Math.random()}
 *
 * 6. **Conditional Classes**
 *    - ${button.isActive ? styles.active : ''}
 *    - Adds class when condition is true
 *    - Common pattern for styling based on state
 *
 * 7. **Button States**
 *    - isActive: visual feedback for toggles
 *    - disabled: prevent clicking when action unavailable
 *    - aria-pressed: accessibility for toggle buttons
 *
 * Event Handling Patterns:
 *
 * ```jsx
 * // ✅ Correct - pass function reference
 * onClick={handleClick}
 *
 * // ✅ Correct - arrow function if you need to pass arguments
 * onClick={() => handleClick(id)}
 *
 * // ❌ Wrong - calls function immediately!
 * onClick={handleClick()}
 *
 * // ❌ Wrong - string instead of function
 * onClick="handleClick()"
 * ```
 *
 * Why Data-Driven Rendering?
 *
 * Before (repetitive):
 * ```jsx
 * <button onClick={toggleMusic}>Music</button>
 * <button onClick={toggleMute}>Mute</button>
 * <button onClick={toggleDark}>Dark</button>
 * // ... repeat 7 times
 * ```
 *
 * After (DRY):
 * ```jsx
 * const buttons = [...]; // Define once
 * {buttons.map(btn => <button>...)} // Render all
 * ```
 *
 * Benefits:
 * ✅ Less code duplication
 * ✅ Easier to maintain
 * ✅ Easier to add new buttons
 * ✅ Consistent styling and behavior
 *
 * Accessibility Features:
 * - role="toolbar": Groups related controls
 * - aria-label: Describes each button clearly
 * - aria-pressed: Toggle state for screen readers
 * - disabled: Prevents interaction when inappropriate
 *
 * Try This:
 * - Add a new button (e.g., "Help")
 * - Add keyboard shortcuts (Ctrl+M for mute)
 * - Add tooltips on hover
 * - Group buttons into categories
 * - Add button icons instead of emoji
 *
 * Real-World Applications:
 * - Media player controls
 * - Settings panels
 * - Toolbars (text editors, image editors)
 * - Navigation menus
 * - Any group of related actions
 *
 * Common Patterns:
 * - Map over data to render UI
 * - Toggle buttons with isActive state
 * - Conditional styling based on state
 * - Grouping related controls
 * - Using Context to avoid prop drilling
 *
 * Debugging Tips:
 * - Add console.log in onClick to verify it's called
 * - Check React DevTools for Context values
 * - Verify key warnings in console (each list item needs key!)
 * - Test keyboard navigation (Tab through buttons)
 * - Test with screen reader
 */

export default ControlButtons;
