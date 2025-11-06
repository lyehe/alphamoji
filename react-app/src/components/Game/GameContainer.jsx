/**
 * GameContainer Component
 *
 * WHAT: The main game component that coordinates all game elements
 *
 * WHY: This is the "conductor" that brings together:
 * - Letter displays (previous, current, next)
 * - Emoji card
 * - Keyboard input handling
 * - Timer
 * - Sound effects
 *
 * LEARNING NOTES:
 * - This is a "container component" (manages logic and state)
 * - Coordinates multiple child components
 * - Handles user interaction
 * - Shows how components work together
 */

import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import useKeyboard from '../../hooks/useKeyboard';
import LetterDisplay from './LetterDisplay';
import EmojiCard from './EmojiCard';
import ControlButtons from '../UI/ControlButtons';
import styles from './GameContainer.module.css';

/**
 * GameContainer Component
 *
 * HOW IT WORKS:
 * 1. Gets game state from Context
 * 2. Listens for keyboard input with useKeyboard hook
 * 3. When user presses a key:
 *    - Checks if it's correct
 *    - Plays sound
 *    - Updates game state
 * 4. Displays letters, emoji, and controls
 *
 * LEARNING NOTES:
 * - This component demonstrates "composition" - building complex UI from simple parts
 * - Shows coordination between multiple hooks and components
 * - Example of "smart component" (has logic)
 */
function GameContainer() {
  /**
   * LEARNING: Get everything we need from Context
   * This component is the "controller" that uses all the game functionality
   */
  const {
    // Game state
    previousLetter,
    currentLetter,
    nextLetter,
    isReady,
    isLoading,
    error,

    // Game actions
    checkAnswer,
    handleCorrectAnswer,
    handleIncorrectAnswer,

    // Audio
    playCorrectSound,
    playIncorrectSound,
    initializeAudio,

    // Timer
    reset: resetTimer,
    getElapsedSeconds,

    // UI settings
    isUpperCase,
    isDarkMode,
    currentFont,
  } = useGameContext();

  /**
   * LEARNING: Initialize audio on component mount
   * Remember: browsers block autoplay until user interaction
   * We need to initialize audio system once user does something
   */
  useEffect(() => {
    // Set up audio on first render
    initializeAudio();

    // Start timer for first letter
    resetTimer();
  }, []); // Empty dependency array = run once on mount

  /**
   * Handle key press - the core game logic!
   *
   * LEARNING: This function is called by useKeyboard hook
   * whenever user presses a key
   */
  const handleKeyPress = (pressedKey) => {
    // LEARNING: Guard clause - exit early if not ready
    // Prevents bugs from rapid key presses
    if (!isReady || !currentLetter) {
      console.log('Game not ready or no current letter');
      return;
    }

    // Check if the answer is correct
    const isCorrect = checkAnswer(pressedKey);

    if (isCorrect) {
      // ✅ CORRECT ANSWER!
      console.log('✅ Correct!', pressedKey);

      // Play success sound
      playCorrectSound();

      // Get how long it took
      const timeTaken = getElapsedSeconds();
      console.log(`Time taken: ${timeTaken} seconds`);

      // Update game state (this will fetch next letter)
      handleCorrectAnswer(timeTaken);

      // Reset timer for next letter
      resetTimer();
    } else {
      // ❌ INCORRECT ANSWER
      console.log('❌ Incorrect!', pressedKey, 'Expected:', currentLetter.letter);

      // Play error sound
      playIncorrectSound();

      // Record the error
      handleIncorrectAnswer(pressedKey);
    }
  };

  /**
   * LEARNING: useKeyboard hook handles keyboard events
   * We just need to tell it:
   * - What key we're expecting
   * - What to do on correct answer
   * - Whether it's enabled
   */
  useKeyboard({
    expectedKey: currentLetter?.letter, // The letter we're waiting for
    onCorrect: handleKeyPress, // Called when correct key is pressed
    onIncorrect: handleKeyPress, // Called when wrong key is pressed (we handle both the same)
    enabled: isReady, // Only listen when game is ready
  });

  /**
   * LEARNING: Apply CSS classes based on state
   * This changes the appearance of the entire game area
   */
  const containerClasses = [
    styles.container,
    isDarkMode ? styles.dark : styles.light,
    styles[currentFont], // styles.fredoka or styles.schoolbell
  ].join(' ');

  /**
   * LEARNING: Error state rendering
   * If there's an error, show error message instead of game
   */
  if (error) {
    return (
      <div className={styles.error}>
        <h2>😔 Oops!</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  /**
   * LEARNING: Loading state rendering
   * Show loading spinner while fetching initial data
   */
  if (isLoading && !currentLetter) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>⏳</div>
        <p>Loading game...</p>
      </div>
    );
  }

  /**
   * LEARNING: Main render - the actual game!
   * We compose multiple components together
   */
  return (
    <div className={containerClasses}>
      {/* LEARNING: Header with game title */}
      <header className={styles.header}>
        <h1 className={styles.title}>Alphamoji</h1>
        <p className={styles.subtitle}>Type the letter you see!</p>
      </header>

      {/* LEARNING: Main game area */}
      <main className={styles.gameArea}>
        {/* Emoji display - shows the picture */}
        <section className={styles.emojiSection} aria-label="Emoji to identify">
          <EmojiCard
            emoji={currentLetter?.emoji}
            displayText={currentLetter?.displayText}
            isLoading={isLoading}
          />
        </section>

        {/* Letter displays - shows previous, current, next letters */}
        <section className={styles.lettersSection} aria-label="Letters">
          <div className={styles.lettersContainer}>
            <LetterDisplay
              letter={previousLetter?.letter}
              type="previous"
              isUpperCase={isUpperCase}
            />

            <LetterDisplay
              letter={currentLetter?.letter}
              type="current"
              isUpperCase={isUpperCase}
            />

            <LetterDisplay
              letter={nextLetter?.letter}
              type="next"
              isUpperCase={isUpperCase}
            />
          </div>
        </section>

        {/* Instructions for user */}
        <section className={styles.instructions} aria-live="polite">
          {/**
           * LEARNING: aria-live="polite"
           * Announces content changes to screen readers
           * "polite" = wait for user to finish before announcing
           */}
          {isReady ? (
            <p>Press <strong>{currentLetter?.letter}</strong> on your keyboard</p>
          ) : (
            <p>Loading next letter...</p>
          )}
        </section>
      </main>

      {/* LEARNING: Control panel - game settings */}
      <footer className={styles.footer}>
        <ControlButtons />
      </footer>
    </div>
  );
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Component Composition**
 *    - Building complex UI from simple components
 *    - Each component has single responsibility
 *    - GameContainer coordinates them all
 *    - Like LEGO blocks!
 *
 * 2. **Container Component Pattern**
 *    - Manages logic and state
 *    - Coordinates child components
 *    - Handles user interaction
 *    - Also called "Smart Component"
 *
 * 3. **Hook Coordination**
 *    - Multiple hooks working together
 *    - useGameContext: game state
 *    - useKeyboard: input handling
 *    - useEffect: initialization
 *
 * 4. **Event Flow**
 *    User presses key
 *    → useKeyboard detects it
 *    → calls handleKeyPress
 *    → checks if correct
 *    → plays sound
 *    → updates state
 *    → re-renders with new data
 *
 * 5. **Conditional Rendering States**
 *    - Error: Show error message
 *    - Loading: Show spinner
 *    - Ready: Show game
 *    - Always handle all states!
 *
 * 6. **Guard Clauses**
 *    - if (!isReady) return;
 *    - Exits early if conditions not met
 *    - Prevents bugs from invalid states
 *    - Cleaner than nested ifs
 *
 * 7. **Semantic HTML**
 *    - <header>, <main>, <section>, <footer>
 *    - Better for accessibility and SEO
 *    - More meaningful than just <div>
 *
 * 8. **ARIA Attributes**
 *    - aria-label: Describes sections
 *    - aria-live: Announces dynamic content
 *    - Makes app usable with screen readers
 *
 * Component Architecture:
 *
 * GameContainer (Smart/Container)
 * ├── LetterDisplay (Dumb/Presentational) × 3
 * ├── EmojiCard (Dumb/Presentational)
 * └── ControlButtons (Smart/Container)
 *
 * Data Flow:
 * 1. Context provides data
 * 2. GameContainer receives data from Context
 * 3. GameContainer passes data to children via props
 * 4. Children display data
 * 5. User interaction flows back up through callbacks
 *
 * Smart vs Dumb Components:
 *
 * Smart (Container):
 * - Manages state and logic
 * - Coordinates children
 * - Handles events
 * - Example: GameContainer
 *
 * Dumb (Presentational):
 * - Only displays data
 * - Receives props
 * - No business logic
 * - Example: LetterDisplay, EmojiCard
 *
 * Benefits of Separation:
 * ✅ Easier to test (presentational components)
 * ✅ Easier to reuse (presentational components)
 * ✅ Clear responsibilities
 * ✅ Easier to maintain
 *
 * Try This:
 * - Add a score display
 * - Add visual feedback when answer is correct/wrong
 * - Add animation between letters
 * - Add difficulty selector
 * - Add pause button
 *
 * Real-World Applications:
 * - Form wizards (multi-step forms)
 * - Game interfaces
 * - Dashboard layouts
 * - E-commerce product pages
 * - Any complex interactive UI
 *
 * Common Mistakes:
 * ❌ Putting all logic in one component
 * ❌ Not handling loading/error states
 * ❌ Forgetting guard clauses
 * ❌ Not cleaning up event listeners
 * ❌ Passing too many props (use Context!)
 *
 * Best Practices:
 * ✅ Separate smart and dumb components
 * ✅ Handle all states (loading, error, success, empty)
 * ✅ Use guard clauses for early exit
 * ✅ Use semantic HTML
 * ✅ Add accessibility attributes
 * ✅ Keep components focused and single-purpose
 *
 * Debugging Tips:
 * - Add console.log in handleKeyPress to see key presses
 * - Use React DevTools to inspect props flow
 * - Check Context value in DevTools
 * - Test each state (loading, error, success)
 * - Test keyboard input is being captured
 */

export default GameContainer;
