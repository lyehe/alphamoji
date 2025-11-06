/**
 * MobileKeyboard Component
 *
 * WHAT: Virtual keyboard for mobile devices
 *
 * WHY: Mobile devices need on-screen keyboard for typing
 *
 * LEARNING: This is a simplified version. In production, you'd add:
 * - Full QWERTY layout
 * - Touch event handling
 * - Visual feedback on press
 */

import React from 'react';
import styles from './MobileKeyboard.module.css';

function MobileKeyboard({ onKeyPress, currentLetter }) {
  // Generate array of letters A-Z
  // LEARNING: Array.from with length and map function
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  const handleLetterClick = (letter) => {
    // Call parent's onKeyPress function
    onKeyPress?.(letter);
  };

  return (
    <div className={styles.keyboard}>
      <p className={styles.hint}>Tap a letter:</p>
      <div className={styles.keys}>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`${styles.key} ${
              letter === currentLetter?.toUpperCase() ? styles.highlight : ''
            }`}
            onClick={() => handleLetterClick(letter)}
            aria-label={`Type letter ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MobileKeyboard;
