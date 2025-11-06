/**
 * useGameState Custom Hook
 *
 * WHAT: Manages the entire game state and logic
 *
 * WHY: This is the "brain" of the game. It handles:
 * - Current, previous, and next letters
 * - Checking if answers are correct
 * - Fetching new letters from the API
 * - Managing game readiness
 *
 * LEARNING NOTES:
 * - This is a complex custom hook that combines multiple React hooks
 * - It encapsulates game logic so components stay simple
 * - Uses async/await for API calls
 * - Manages multiple pieces of related state together
 */

import { useState, useEffect } from 'react';
import { getRandomLetter, reportError, updateHistory } from '../services/api';

/**
 * useGameState Hook
 *
 * HOW IT WORKS:
 * 1. Initializes game by fetching first letters
 * 2. Provides functions to check answers
 * 3. Automatically fetches next letter when answer is correct
 * 4. Manages game state (ready, loading, etc.)
 *
 * @returns {Object} Game state and control functions
 *
 * LEARNING NOTES:
 * - This hook demonstrates how to manage complex state
 * - Shows how to coordinate multiple async operations
 * - Example of "separation of concerns" - all game logic is here!
 */
function useGameState() {
  // ======================================================================
  // STATE MANAGEMENT
  // ======================================================================

  /**
   * LEARNING: We use multiple useState calls instead of one big object
   * This is fine! React is optimized for this.
   *
   * Alternative approach (also valid):
   * const [gameState, setGameState] = useState({
   *   currentLetter: null,
   *   previousLetter: null,
   *   nextLetter: null,
   *   isReady: false,
   *   isLoading: false,
   * });
   *
   * We use separate states because:
   * - Easier to update individual pieces
   * - Clearer what's changing
   * - More beginner-friendly
   */

  // The three letters we're tracking
  const [previousLetter, setPreviousLetter] = useState(null);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [nextLetter, setNextLetter] = useState(null);

  // Is the game ready for input?
  // LEARNING: We disable input while loading new letters to prevent bugs
  const [isReady, setIsReady] = useState(false);

  // Are we currently loading letters from the API?
  const [isLoading, setIsLoading] = useState(false);

  // Has there been an error?
  const [error, setError] = useState(null);

  // ======================================================================
  // INITIALIZATION
  // ======================================================================

  /**
   * Initialize the game when component mounts
   *
   * LEARNING: useEffect with empty dependency array runs once on mount
   * Perfect for initialization!
   */
  useEffect(() => {
    initializeGame();
  }, []); // Empty array = run once when component appears

  /**
   * Initializes the game by fetching initial letters
   *
   * WHY ASYNC: API calls take time, so we use async/await
   *
   * LEARNING: We fetch current and next letter at the same time
   * using Promise.all for better performance
   */
  const initializeGame = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // LEARNING: Promise.all runs multiple promises in parallel
      // Much faster than awaiting them one by one!
      // Instead of:
      //   const current = await getRandomLetter();  // Wait...
      //   const next = await getRandomLetter();     // ...then wait again
      // We do:
      //   const [current, next] = await Promise.all([...]);  // Both at once!
      const [currentData, nextData] = await Promise.all([
        getRandomLetter(),
        getRandomLetter(),
      ]);

      // Check if API calls succeeded
      if (!currentData || !nextData) {
        throw new Error('Failed to fetch initial letters');
      }

      // Set the initial state
      setCurrentLetter(currentData);
      setNextLetter(nextData);

      // Create a fake previous letter
      // LEARNING: We need 3 letters for the UI (previous, current, next)
      // But on first load, there is no previous letter, so we fake one
      setPreviousLetter({
        letter: '?',
        emoji: '👻',
        displayText: 'Start',
      });

      // Game is ready!
      setIsReady(true);
    } catch (err) {
      console.error('Error initializing game:', err);
      setError('Failed to start game. Please refresh the page.');
    } finally {
      // LEARNING: finally always runs, whether there was an error or not
      // Perfect for cleanup like setting loading to false
      setIsLoading(false);
    }
  };

  // ======================================================================
  // GAME LOGIC
  // ======================================================================

  /**
   * Checks if the pressed key is correct
   *
   * @param {string} pressedKey - The key the user pressed
   * @returns {boolean} True if correct, false otherwise
   *
   * LEARNING: Simple validation logic
   * We normalize both keys to uppercase to ignore case
   */
  const checkAnswer = (pressedKey) => {
    if (!currentLetter) return false;

    const normalizedPressed = pressedKey.toUpperCase();
    const normalizedExpected = currentLetter.letter.toUpperCase();

    return normalizedPressed === normalizedExpected;
  };

  /**
   * Handles a correct answer
   *
   * WHAT HAPPENS:
   * 1. Mark game as not ready (prevent multiple inputs)
   * 2. Send data to backend
   * 3. Shift letters (current becomes previous, next becomes current)
   * 4. Fetch new next letter
   * 5. Mark game as ready again
   *
   * @param {number} timeTaken - How long it took in seconds
   *
   * LEARNING: This is an async function because it:
   * - Updates backend (API call)
   * - Fetches new letter (API call)
   */
  const handleCorrectAnswer = async (timeTaken) => {
    if (!isReady || !currentLetter) return;

    try {
      // Prevent multiple answers while processing
      setIsReady(false);

      // Send data to backend (don't wait for it, we don't need the response)
      // LEARNING: We don't await this because we don't need to wait for it
      // The game can continue even if this fails
      updateHistory(
        currentLetter.letter,
        timeTaken,
        currentLetter.emoji,
        currentLetter.displayText
      ).catch((err) => {
        // Handle error silently - don't interrupt game
        console.error('Failed to update history:', err);
      });

      // Fetch the new next letter
      const newNextLetter = await getRandomLetter();

      if (!newNextLetter) {
        throw new Error('Failed to fetch next letter');
      }

      // Shift the letters
      // LEARNING: This is like a sliding window
      // [Previous] [Current] [Next]
      //     ↑          ↑        ↑
      //              [Previous] [Current] [Next]
      setPreviousLetter(currentLetter);
      setCurrentLetter(nextLetter);
      setNextLetter(newNextLetter);

      // Ready for next input!
      setIsReady(true);
    } catch (err) {
      console.error('Error handling correct answer:', err);
      setError('Something went wrong. Please try again.');
      setIsReady(true); // Let user try again
    }
  };

  /**
   * Handles an incorrect answer
   *
   * WHAT HAPPENS:
   * 1. Mark game as not ready (show feedback)
   * 2. Report error to backend
   * 3. Wait a moment (let user see feedback)
   * 4. Mark game as ready again
   *
   * @param {string} incorrectKey - The wrong key that was pressed
   *
   * LEARNING: We add a small delay so user sees the error feedback
   */
  const handleIncorrectAnswer = async (incorrectKey) => {
    if (!isReady || !currentLetter) return;

    try {
      // Show feedback (prevent input while showing error)
      setIsReady(false);

      // Report error to backend (fire and forget)
      reportError(currentLetter.letter).catch((err) => {
        console.error('Failed to report error:', err);
      });

      // LEARNING: setTimeout with Promise for waiting
      // This pauses for 500ms to show error feedback
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ready to try again
      setIsReady(true);
    } catch (err) {
      console.error('Error handling incorrect answer:', err);
      setIsReady(true); // Recover gracefully
    }
  };

  // ======================================================================
  // RETURN VALUES
  // ======================================================================

  /**
   * LEARNING: We return an object with all the state and functions
   * Components can destructure what they need:
   *
   * const { currentLetter, checkAnswer } = useGameState();
   */
  return {
    // State
    previousLetter,
    currentLetter,
    nextLetter,
    isReady,
    isLoading,
    error,

    // Functions
    checkAnswer,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    initializeGame, // Allow manual re-initialization if needed
  };
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Complex State Management**
 *    - Multiple useState calls for different pieces of state
 *    - Alternative: Single state object with multiple properties
 *    - Both approaches work, choose what's clearest
 *
 * 2. **Async Operations in Hooks**
 *    - Use async functions for API calls
 *    - Handle loading and error states
 *    - Use try/catch/finally for error handling
 *    - Promise.all for parallel operations
 *
 * 3. **Initialization Pattern**
 *    - useEffect with [] runs once on mount
 *    - Perfect for fetching initial data
 *    - Set loading states appropriately
 *
 * 4. **State Coordination**
 *    - Multiple pieces of state that work together
 *    - isReady prevents race conditions
 *    - Loading states provide user feedback
 *
 * 5. **Error Handling**
 *    - Always try/catch async operations
 *    - Provide useful error messages
 *    - Recover gracefully (don't crash!)
 *    - Use finally for cleanup
 *
 * 6. **Fire and Forget Pattern**
 *    - Some API calls don't need awaiting (updateHistory)
 *    - Use .catch() to handle errors silently
 *    - Don't block user experience for non-critical operations
 *
 * Patterns Demonstrated:
 * - Initialization on mount
 * - Loading and error states
 * - Async state updates
 * - Input disabling during operations
 * - Sliding window (previous/current/next)
 *
 * Real-World Applications:
 * - Forms with validation
 * - Multi-step wizards
 * - Game state machines
 * - Shopping carts
 * - Any app with sequential steps
 *
 * Try This:
 * - Add a score counter
 * - Add difficulty levels
 * - Add a pause/resume feature
 * - Add a reset game function
 * - Track streak of correct answers
 *
 * Common Gotchas:
 * - Forgetting to set isReady back to true after error
 * - Not handling API failures gracefully
 * - Race conditions when not disabling input
 * - Forgetting to check if state exists before using it
 *
 * Debugging Tips:
 * - Add console.log at start and end of each function
 * - Log state changes to see the flow
 * - Use React DevTools to inspect state
 * - Check Network tab for API failures
 * - Test error cases by making API return null
 */

export default useGameState;
