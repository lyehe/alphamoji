/**
 * LetterDisplay Component
 *
 * WHAT: Displays a single letter in the game
 *
 * WHY: We show three letters (previous, current, next) to give context
 * This component handles displaying one of those letters
 *
 * LEARNING NOTES:
 * - This is a "presentational component" (displays data, no logic)
 * - Uses props to receive data from parent
 * - Uses CSS Modules for scoped styling
 * - Demonstrates conditional rendering and className composition
 */

import React from 'react';
import styles from './LetterDisplay.module.css';

/**
 * LetterDisplay Component
 *
 * @param {Object} props - Component properties
 * @param {string} props.letter - The letter to display (e.g., "A")
 * @param {string} props.type - Type of letter: 'previous', 'current', or 'next'
 * @param {boolean} props.isUpperCase - Whether to show uppercase or lowercase
 * @param {string} props.className - Additional CSS classes
 *
 * EXAMPLE USAGE:
 * ```jsx
 * <LetterDisplay
 *   letter="A"
 *   type="current"
 *   isUpperCase={true}
 * />
 * ```
 *
 * LEARNING NOTES:
 * - Function parameters are "destructured" from props
 * - Instead of: function LetterDisplay(props) { const letter = props.letter; ... }
 * - We write: function LetterDisplay({ letter, type, isUpperCase })
 * - Much cleaner!
 */
function LetterDisplay({ letter, type = 'current', isUpperCase = true, className = '' }) {
  /**
   * LEARNING: Early return pattern
   * If there's no letter, don't render anything
   * This prevents errors and unnecessary DOM elements
   */
  if (!letter) {
    return null; // null means "don't render anything"
  }

  /**
   * LEARNING: Transform data before displaying
   * We decide to show uppercase or lowercase based on prop
   */
  const displayLetter = isUpperCase ? letter.toUpperCase() : letter.toLowerCase();

  /**
   * LEARNING: Conditional CSS classes
   * We combine multiple class names based on conditions
   *
   * How it works:
   * 1. styles.letter - Base style (always applied)
   * 2. styles[type] - Dynamic style based on type prop
   * 3. className - Additional classes from parent
   *
   * Result: "LetterDisplay_letter LetterDisplay_current custom-class"
   */
  const letterClasses = [
    styles.letter, // Base class
    styles[type], // Dynamic class: styles.previous, styles.current, or styles.next
    className, // Any additional classes passed from parent
  ]
    .filter(Boolean) // Remove any undefined/null values
    .join(' '); // Join with spaces: "class1 class2 class3"

  /**
   * LEARNING: data- attributes
   * We can store custom data in HTML elements using data- attributes
   * Useful for:
   * - Storing values for JavaScript to access later
   * - CSS selectors ([data-type="current"])
   * - Testing (finding elements in tests)
   */
  return (
    <div
      className={letterClasses}
      data-type={type}
      data-letter={letter}
      aria-label={`${type} letter: ${displayLetter}`}
      /**
       * LEARNING: aria-label for accessibility
       * Screen readers will announce: "current letter: A"
       * Makes our app usable for people with visual impairments
       */
    >
      <span className={styles.letterText}>{displayLetter}</span>

      {/* LEARNING: Conditional rendering with && operator */}
      {/* Only show label for previous/next letters */}
      {type !== 'current' && (
        <span className={styles.label}>
          {type === 'previous' ? 'Previous' : 'Next'}
        </span>
      )}
    </div>
  );
}

/**
 * LEARNING SUMMARY:
 *
 * Component Concepts:
 *
 * 1. **Props (Properties)**
 *    - Data passed from parent to child component
 *    - Read-only (components can't modify their props)
 *    - Destructured for cleaner code
 *    - Can have default values
 *
 * 2. **Presentational Component**
 *    - Only displays data (no business logic)
 *    - Receives all data via props
 *    - Easy to test and reuse
 *    - Also called "Dumb Component" or "UI Component"
 *
 * 3. **Conditional Rendering**
 *    - if (!letter) return null - Don't render if no data
 *    - condition && <Component /> - Render only if condition is true
 *    - condition ? <A /> : <B /> - Render A or B based on condition
 *
 * 4. **CSS Modules**
 *    - Import styles: import styles from './file.module.css'
 *    - Use styles: className={styles.letter}
 *    - Automatically scoped (won't conflict with other components)
 *
 * 5. **Dynamic Class Names**
 *    - Combine multiple classes with array and join
 *    - Use bracket notation for dynamic keys: styles[type]
 *    - Filter falsy values to avoid empty classes
 *
 * 6. **Accessibility (a11y)**
 *    - aria-label describes elements for screen readers
 *    - Makes apps usable for people with disabilities
 *    - Good practice to always include!
 *
 * 7. **data- Attributes**
 *    - Store custom data on HTML elements
 *    - Access in JavaScript: element.dataset.type
 *    - Use in CSS: [data-type="current"]
 *
 * Props vs State:
 * - Props: Passed from parent (read-only)
 * - State: Managed within component (can change)
 * - This component only uses props (presentational)
 *
 * Component Patterns:
 * - Default props: type = 'current'
 * - Early return: if (!letter) return null
 * - Data transformation: toUpperCase/toLowerCase
 * - Conditional rendering: type !== 'current' && <Label />
 *
 * Try This:
 * - Add a "size" prop to make letters bigger/smaller
 * - Add animation when letter changes
 * - Add a click handler to highlight the letter
 * - Make letters flash different colors
 *
 * Real-World Applications:
 * - Profile card components
 * - Product list items
 * - Notification components
 * - Any UI that displays data
 */

export default LetterDisplay;
