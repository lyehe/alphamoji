import { getRandomLetter, reportError, updateTimeTaken } from "./api.js";
import { startTimer, resetTimer, getElapsedTime } from "./timer.js";
import { updateDisplay } from "./ui.js";
import { playCorrectSound, playIncorrectSound } from "./audio.js";

let previousLetterData = null;
let currentLetterData = null;
let nextLetterData = null;
let readyForInput = false;

/**
 * Initializes the game by fetching initial letters and setting up the display.
 */
export async function initializeGame() {
  try {
    [currentLetterData, nextLetterData] = await Promise.all([
      getRandomLetter(),
      getRandomLetter(),
    ]);

    if (currentLetterData && nextLetterData) {
      // Create a fake previous letter
      previousLetterData = {
        letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        emoji: "👻",
        displayText: "Placeholder",
      };

      updateDisplay(previousLetterData, currentLetterData, nextLetterData);
      startTimer();
      readyForInput = true;
    } else {
      throw new Error("Failed to initialize game due to API errors");
    }
  } catch (error) {
    console.error("Error initializing game:", error);
  }
}

/**
 * Checks if the game is ready for user input.
 * @returns {boolean} True if ready for input, false otherwise.
 */
export function isReadyForInput() {
  return readyForInput;
}

/**
 * Handles a correct guess by the user.
 */
export async function handleCorrectGuess() {
  if (!readyForInput || !currentLetterData) return;

  readyForInput = false;
  const letterDisplay = document.getElementById("letter-display");
  const feedback = document.getElementById("feedback");

  letterDisplay.style.color = "#4CAF50";
  feedback.textContent = "🎉 Correct!";
  playCorrectSound();

  const timeTaken = getElapsedTime();
  await updateTimeTaken(currentLetterData.letter, timeTaken);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  previousLetterData = currentLetterData;
  currentLetterData = nextLetterData;
  nextLetterData = await getRandomLetter();

  updateDisplay(previousLetterData, currentLetterData, nextLetterData);
  resetTimer();
  readyForInput = true;
}

/**
 * Handles an incorrect guess by the user.
 */
export function handleIncorrectGuess() {
  if (!readyForInput || !currentLetterData) return;

  readyForInput = false;
  const letterDisplay = document.getElementById("letter-display");
  const feedback = document.getElementById("feedback");

  letterDisplay.style.color = "#FF5252";
  feedback.textContent = "😕 Try again!";
  playIncorrectSound();

  reportError(currentLetterData.letter);

  setTimeout(() => {
    readyForInput = true;
  }, 500);
}

/**
 * Handles a key press event.
 * @param {KeyboardEvent} event - The key press event.
 */
export function handleKeyPress(event) {
  if (!isReadyForInput()) return;

  const pressedKey = event.key.toUpperCase();
  const letterDisplay = document.getElementById("letter-display");
  const nextLetter = document.getElementById("next-letter");
  const currentLetter = letterDisplay.dataset.originalLetter;

  if (currentLetter) {
    if (pressedKey === currentLetter) {
      handleCorrectGuess();
    } else {
      handleIncorrectGuess();
    }
  } else if (
    nextLetter &&
    pressedKey === nextLetter.textContent.toUpperCase()
  ) {
    handleCorrectGuess();
  } else {
    handleIncorrectGuess();
  }

  disableInputTemporarily();
}
