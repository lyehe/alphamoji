/**
 * useKeyboard Custom Hook
 *
 * WHAT: Listens for keyboard input and provides callbacks for different keys
 *
 * WHY: Keyboard handling requires:
 * - Adding event listeners
 * - Removing them on cleanup (important!)
 * - Filtering which keys we care about
 * - Preventing default browser behavior
 *
 * LEARNING NOTES:
 * - This hook uses useEffect to manage event listeners
 * - Event listeners must be cleaned up to prevent memory leaks
 * - We use useCallback to create stable callback functions
 */

import { useEffect, useCallback, useState } from 'react';

/**
 * useKeyboard Hook
 *
 * HOW IT WORKS:
 * 1. Adds a keydown event listener to the document
 * 2. When a key is pressed, checks if it matches expected key
 * 3. Calls onCorrect or onIncorrect callback
 * 4. Removes event listener when component unmounts (cleanup!)
 *
 * @param {Object} options - Configuration options
 * @param {string} options.expectedKey - The key we're waiting for (e.g., "A")
 * @param {Function} options.onCorrect - Called when correct key is pressed
 * @param {Function} options.onIncorrect - Called when wrong key is pressed
 * @param {boolean} options.enabled - Whether keyboard input is active
 *
 * EXAMPLE USAGE:
 * ```jsx
 * function MyComponent() {
 *   useKeyboard({
 *     expectedKey: 'A',
 *     onCorrect: () => console.log('Correct!'),
 *     onIncorrect: () => console.log('Wrong!'),
 *     enabled: true,
 *   });
 *
 *   return <div>Press the 'A' key!</div>;
 * }
 * ```
 */
function useKeyboard({ expectedKey, onCorrect, onIncorrect, enabled = true }) {
  /**
   * Handles the keydown event
   *
   * LEARNING: useCallback creates a memoized function
   * This means React won't recreate this function on every render
   * (unless the dependencies change)
   *
   * WHY: Important for useEffect dependencies and performance
   */
  const handleKeyDown = useCallback(
    (event) => {
      // LEARNING: If disabled, do nothing
      if (!enabled) return;

      // Get the key that was pressed
      // LEARNING: event.key gives us the character ('a', 'A', 'Enter', etc.)
      const pressedKey = event.key;

      // LEARNING: Ignore special keys like Tab, Shift, etc.
      // We only care about letter/number keys
      if (pressedKey.length !== 1) {
        return; // It's a special key, ignore it
      }

      // Convert to uppercase for comparison
      // LEARNING: This way 'a' and 'A' are treated the same
      const normalizedKey = pressedKey.toUpperCase();
      const normalizedExpectedKey = expectedKey?.toUpperCase();

      // LEARNING: Prevent default browser behavior
      // (like space key scrolling the page)
      event.preventDefault();

      // Check if the key is correct
      if (normalizedKey === normalizedExpectedKey) {
        onCorrect?.(normalizedKey); // LEARNING: ?. = optional chaining (call only if exists)
      } else {
        onIncorrect?.(normalizedKey, normalizedExpectedKey);
      }
    },
    // LEARNING: Dependencies array - handleKeyDown is recreated when these change
    [expectedKey, onCorrect, onIncorrect, enabled]
  );

  /**
   * Set up and tear down the event listener
   *
   * LEARNING: This useEffect manages the keyboard event listener lifecycle
   */
  useEffect(() => {
    // Only add listener if enabled
    if (!enabled) return;

    // LEARNING: Add event listener to document
    // We use document instead of window to catch keys anywhere on the page
    document.addEventListener('keydown', handleKeyDown);

    // LEARNING: Cleanup function
    // This runs when:
    // 1. Component unmounts
    // 2. Before effect runs again (if dependencies changed)
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

    // LEARNING: Dependencies - effect re-runs when handleKeyDown changes
    // (which happens when expectedKey, onCorrect, onIncorrect, or enabled change)
  }, [handleKeyDown, enabled]);

  // This hook doesn't return anything
  // It just manages the side effect of listening to keyboard
}

/**
 * Alternative version: useKeyboardWithReturn
 *
 * This version returns the last pressed key instead of using callbacks.
 * Good for different use cases!
 *
 * LEARNING: There's often multiple ways to design a hook
 * Choose based on your needs
 */
export function useKeyboardWithReturn({ enabled = true } = {}) {
  const [lastKey, setLastKey] = useState(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const pressedKey = event.key;

      // Ignore special keys
      if (pressedKey.length !== 1) return;

      event.preventDefault();

      // Store the key in state
      setLastKey(pressedKey.toUpperCase());
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Return the last pressed key
  return { lastKey };
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Event Listeners in React**
 *    - Add with addEventListener in useEffect
 *    - ALWAYS remove with removeEventListener in cleanup
 *    - Forgetting cleanup causes memory leaks!
 *
 * 2. **useCallback Hook**
 *    - Creates a memoized version of a function
 *    - Function reference stays the same unless dependencies change
 *    - Prevents unnecessary re-renders and effect re-runs
 *    - Important when passing functions as dependencies
 *
 * 3. **useEffect Cleanup**
 *    - The return function is the cleanup
 *    - Runs before effect re-runs and when component unmounts
 *    - Critical for event listeners to prevent memory leaks
 *    - Pattern: Add in effect, remove in cleanup
 *
 * 4. **Event Object**
 *    - event.key: the key that was pressed ('a', 'Enter', 'Shift')
 *    - event.preventDefault(): stop default browser behavior
 *    - event.stopPropagation(): stop event from bubbling up
 *
 * 5. **Optional Chaining (?.)**
 *    - callback?.() calls callback only if it exists
 *    - Prevents errors if callback is undefined
 *    - Shorter than: if (callback) callback()
 *
 * Common Gotchas:
 * - Forgetting to remove event listeners causes memory leaks
 * - Not using useCallback causes infinite effect loops
 * - Adding listener to wrong element (window vs document vs element)
 * - Forgetting preventDefault can cause unwanted browser behavior
 *
 * Hook Design Patterns:
 * - Callback-based: Pass callbacks to the hook (this version)
 * - State-based: Hook returns state (useKeyboardWithReturn)
 * - Both approaches are valid, choose based on your needs!
 *
 * When to use each:
 * - Callbacks: When you want to perform an action immediately
 * - State: When you want to store and display the value
 *
 * Try This:
 * - Add support for arrow keys
 * - Create a useKeyCombo hook for key combinations (Ctrl+S, etc.)
 * - Add debouncing to prevent rapid key presses
 * - Track which keys are currently held down
 *
 * Debugging Tips:
 * - Add console.log in handleKeyDown to see which keys are pressed
 * - Check if event listener is being removed (add log in cleanup)
 * - Use React DevTools to see effect dependencies
 * - Test with browser DevTools Event Listeners panel
 */

export default useKeyboard;
