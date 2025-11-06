/**
 * EmojiCard Component
 *
 * WHAT: Displays an emoji and its name in a card format
 *
 * WHY: The game teaches letters through emojis (🍎 for Apple → A)
 * This component shows the emoji in a visually appealing way
 *
 * LEARNING NOTES:
 * - Another presentational component
 * - Demonstrates loading states and placeholder content
 * - Shows how to handle missing data gracefully
 */

import React from 'react';
import styles from './EmojiCard.module.css';

/**
 * EmojiCard Component
 *
 * @param {Object} props - Component properties
 * @param {string} props.emoji - The emoji to display (e.g., "🍎")
 * @param {string} props.displayText - The emoji's name (e.g., "Apple")
 * @param {boolean} props.isLoading - Whether data is still loading
 * @param {string} props.className - Additional CSS classes
 *
 * EXAMPLE USAGE:
 * ```jsx
 * <EmojiCard
 *   emoji="🍎"
 *   displayText="Apple"
 *   isLoading={false}
 * />
 * ```
 */
function EmojiCard({ emoji, displayText, isLoading = false, className = '' }) {
  /**
   * LEARNING: Handle loading state
   * Show a placeholder while data is loading
   * Better UX than showing nothing or an error
   */
  if (isLoading) {
    return (
      <div className={`${styles.card} ${styles.loading} ${className}`}>
        <div className={styles.spinner}>
          {/* LEARNING: Unicode spinner character - simple loading indicator! */}
          <span aria-label="Loading">⏳</span>
        </div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  /**
   * LEARNING: Handle missing data
   * If no emoji is provided, show a placeholder
   * Prevents blank cards and confuses users
   */
  if (!emoji) {
    return (
      <div className={`${styles.card} ${styles.empty} ${className}`}>
        <div className={styles.placeholder}>
          <span aria-label="No emoji">❓</span>
        </div>
        <p className={styles.placeholderText}>Press any key to start</p>
      </div>
    );
  }

  /**
   * LEARNING: Normal render
   * When we have all the data, show the emoji and name
   */
  return (
    <div
      className={`${styles.card} ${className}`}
      /**
       * LEARNING: aria-label for accessibility
       * Screen readers will read: "Emoji card showing Apple emoji"
       */
      aria-label={`Emoji card showing ${displayText || 'emoji'}`}
    >
      {/* The big emoji display */}
      <div className={styles.emojiDisplay}>
        <span
          className={styles.emoji}
          /**
           * LEARNING: role="img" tells screen readers this is an image
           * Some screen readers don't announce emojis by default
           */
          role="img"
          aria-label={displayText || 'emoji'}
        >
          {emoji}
        </span>
      </div>

      {/* The emoji name/description */}
      {displayText && (
        <div className={styles.textDisplay}>
          <p className={styles.emojiName}>{displayText}</p>
        </div>
      )}

      {/* LEARNING: Decorative element - card border/shadow effect */}
      <div className={styles.cardBorder} aria-hidden="true" />
      {/**
       * aria-hidden="true" tells screen readers to ignore this element
       * It's purely visual decoration, no semantic meaning
       */}
    </div>
  );
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **Loading States**
 *    - Always show feedback during async operations
 *    - Options: spinner, skeleton, placeholder
 *    - Better UX than blank screen or error
 *
 * 2. **Placeholder Content**
 *    - Show helpful content when no data exists
 *    - Guide user on what to do next
 *    - Example: "Press any key to start"
 *
 * 3. **Defensive Programming**
 *    - Check if data exists before using it
 *    - Handle all possible states: loading, empty, error, success
 *    - Don't assume data will always be there!
 *
 * 4. **Template Literals for Classes**
 *    - `${styles.card} ${styles.loading}` combines classes
 *    - Alternative to array.join() method
 *    - Both approaches work, use what's clearer!
 *
 * 5. **Accessibility (a11y)**
 *    - role="img" for emoji (some screen readers need this)
 *    - aria-label describes what's in the image
 *    - aria-hidden for decorative elements
 *    - Makes app usable for everyone!
 *
 * 6. **Component States**
 *    - Loading: Show spinner
 *    - Empty: Show placeholder
 *    - Error: Show error message (not implemented here, but could be!)
 *    - Success: Show actual content
 *
 * Component Design Patterns:
 *
 * 1. **Multiple Return Statements**
 *    - Check loading state → return loading UI
 *    - Check empty state → return empty UI
 *    - Finally → return normal UI
 *    - Cleaner than nested ternaries!
 *
 * 2. **Conditional Rendering**
 *    - isLoading: Show spinner
 *    - !emoji: Show placeholder
 *    - else: Show emoji
 *    - Always handle all states!
 *
 * 3. **Default Props**
 *    - isLoading = false
 *    - className = ''
 *    - Makes component easier to use
 *    - Prevents undefined errors
 *
 * Comparison with LetterDisplay:
 * - Both are presentational components
 * - Both use CSS Modules
 * - Both handle missing data
 * - EmojiCard adds loading state (LetterDisplay could too!)
 *
 * Try This:
 * - Add error state for failed emoji loads
 * - Add animation when emoji appears
 * - Add flip animation to reveal emoji
 * - Make emoji pulse or bounce
 * - Add sound when emoji is revealed
 *
 * Real-World Applications:
 * - Product cards in e-commerce
 * - User profile cards
 * - Social media posts
 * - Image galleries
 * - Any card-based UI
 *
 * Common Mistakes:
 * ❌ Not handling loading state
 * ❌ Not handling empty state
 * ❌ Assuming data will always exist
 * ❌ Not providing accessibility labels
 * ❌ Blank screen when data is missing
 *
 * Best Practices:
 * ✅ Always handle loading, empty, error, success states
 * ✅ Provide helpful placeholders
 * ✅ Add accessibility labels
 * ✅ Use defensive checks (!emoji, !displayText)
 * ✅ Give user feedback for every state
 *
 * Debugging Tips:
 * - Add console.log to see which state is rendering
 * - Use React DevTools to inspect props
 * - Test with: no data, loading, slow connection
 * - Check accessibility with screen reader or aXe DevTools
 */

export default EmojiCard;
