import { handleCorrectGuess, handleIncorrectGuess, isReadyForInput } from './game.js';

const INPUT_COOLDOWN = 500; // Cooldown period in milliseconds

/**
 * Handles key press events for the game.
 * @param {KeyboardEvent} event - The key press event.
 */
export function handleKeyPress(event) {
  if (!isReadyForInput()) return;

  const pressedKey = event.key.toUpperCase();
  const letterDisplay = document.getElementById("letter-display");
  const nextLetter = document.getElementById("next-letter");
  const currentLetter = letterDisplay.textContent.trim();

  if (currentLetter) {
    if (pressedKey === currentLetter.toUpperCase()) {
      handleCorrectGuess();
    } else {
      handleIncorrectGuess();
    }
  } else if (nextLetter && pressedKey === nextLetter.textContent.trim().toUpperCase()) {
    handleCorrectGuess();
  } else {
    handleIncorrectGuess();
  }

  disableInputTemporarily();
}

/**
 * Temporarily disables input handling and re-enables it after a cooldown period.
 */
function disableInputTemporarily() {
  document.removeEventListener("keydown", handleKeyPress);
  
  setTimeout(() => {
    document.addEventListener("keydown", handleKeyPress);
  }, INPUT_COOLDOWN);
}

// ... (other input-related functions)