/**
 * useTimer Custom Hook
 *
 * WHAT: A custom hook that tracks elapsed time (like a stopwatch)
 *
 * WHY: We need to measure how long it takes for users to type each letter.
 * By extracting this into a hook, we can reuse it anywhere and keep our
 * components clean.
 *
 * LEARNING NOTES:
 * - Custom hooks are just functions that use other hooks
 * - They MUST start with "use" (React convention)
 * - They help organize and reuse logic across components
 * - This hook uses useState and useRef (built-in React hooks)
 */

import { useState, useRef } from 'react';

/**
 * useTimer Hook
 *
 * HOW IT WORKS:
 * 1. Stores the start time when reset() is called
 * 2. Calculates elapsed time by comparing current time to start time
 * 3. Returns functions to control the timer
 *
 * @returns {Object} Timer controls and current time
 *
 * EXAMPLE USAGE:
 * ```jsx
 * function MyComponent() {
 *   const { elapsedTime, reset, getElapsedSeconds } = useTimer();
 *
 *   return (
 *     <div>
 *       <p>Time: {elapsedTime}ms</p>
 *       <button onClick={reset}>Start Timer</button>
 *     </div>
 *   );
 * }
 * ```
 */
function useTimer() {
  // LEARNING: useRef stores a value that persists between renders
  // but doesn't cause re-renders when changed (unlike useState)
  // Perfect for storing the start time!
  const startTimeRef = useRef(null);

  // LEARNING: useState stores the elapsed time and triggers re-renders
  // We could calculate this on-demand instead, but storing it is simpler
  const [elapsedTime, setElapsedTime] = useState(0);

  /**
   * Resets the timer to zero and starts counting
   *
   * LEARNING: Date.now() returns current time in milliseconds since 1970
   * (called Unix timestamp or epoch time)
   */
  const reset = () => {
    startTimeRef.current = Date.now(); // Store current time
    setElapsedTime(0); // Reset elapsed time to zero
  };

  /**
   * Gets the elapsed time in seconds
   *
   * WHY SECONDS: The backend expects time in seconds, not milliseconds
   *
   * HOW IT WORKS:
   * 1. Get current time (Date.now())
   * 2. Subtract start time to get milliseconds elapsed
   * 3. Divide by 1000 to convert to seconds
   * 4. Round to 2 decimal places
   *
   * @returns {number} Elapsed time in seconds
   *
   * LEARNING: The ?.  is called "optional chaining"
   * It safely accesses startTimeRef.current without crashing if it's null
   */
  const getElapsedSeconds = () => {
    if (!startTimeRef.current) {
      return 0; // Timer hasn't started yet
    }

    const elapsed = Date.now() - startTimeRef.current;
    const seconds = elapsed / 1000;

    // LEARNING: .toFixed(2) rounds to 2 decimal places and returns a string
    // parseFloat() converts it back to a number
    return parseFloat(seconds.toFixed(2));
  };

  /**
   * Gets the elapsed time in milliseconds
   *
   * WHY MILLISECONDS: More precise for internal calculations and display
   *
   * @returns {number} Elapsed time in milliseconds
   */
  const getElapsedMilliseconds = () => {
    if (!startTimeRef.current) {
      return 0;
    }

    return Date.now() - startTimeRef.current;
  };

  /**
   * Starts the timer (same as reset but clearer name)
   *
   * LEARNING: Sometimes having multiple names for the same function
   * makes the code more readable in different contexts
   */
  const start = reset;

  // Return an object with all the timer controls
  // LEARNING: This is the "return value" of the hook
  // Components that use this hook will get these functions and values
  return {
    elapsedTime, // Current elapsed time in milliseconds
    reset, // Function to reset/start the timer
    start, // Alias for reset (clearer in some contexts)
    getElapsedSeconds, // Get time in seconds
    getElapsedMilliseconds, // Get time in milliseconds
  };
}

/**
 * LEARNING SUMMARY:
 *
 * What is a Custom Hook?
 * - A JavaScript function that uses other React hooks
 * - Must start with "use" (React naming convention)
 * - Can be reused across multiple components
 * - Helps extract component logic into reusable functions
 *
 * When to Create a Custom Hook?
 * - When you have logic that could be reused in multiple components
 * - When you want to make a component simpler by extracting complex logic
 * - When you find yourself copying the same hooks code to multiple places
 *
 * useRef vs useState:
 * - useRef: Stores values that DON'T need to trigger re-renders
 * - useState: Stores values that DO need to trigger re-renders
 * - In this hook: startTime uses useRef (we don't need to show it)
 * - elapsedTime uses useState (we might want to display it)
 *
 * Why This Hook is Useful:
 * - Encapsulates timer logic in one place
 * - Easy to test independently
 * - Can be used in any component that needs a timer
 * - Provides a clean, simple API (reset, start, getElapsedSeconds)
 *
 * Try This:
 * - Import and use this hook in a simple component
 * - Add a setInterval to update elapsedTime every 100ms for a live display
 * - Create a useStopwatch hook that builds on this one
 */

export default useTimer;
