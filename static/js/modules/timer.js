/**
 * Module for managing a simple timer functionality.
 */

let startTime;
let timerInterval;
let displayElement;

/**
 * Starts the timer, updating the display every second.
 */
export function startTimer() {
  startTime = Date.now();
  displayElement = document.getElementById("timer-value");
  updateTimer(); // Update immediately
  timerInterval = setInterval(updateTimer, 100); // Update every 100ms for smoother display
}

/**
 * Resets the timer to zero and starts it again.
 */
export function resetTimer() {
  clearInterval(timerInterval);
  startTimer();
}

/**
 * Returns the elapsed time in seconds.
 */
export function getElapsedTime() {
  return (Date.now() - startTime) / 1000; // Return elapsed time in seconds
}

/**
 * Updates the timer display with the current elapsed time.
 */
function updateTimer() {
  if (!displayElement) return;
  
  const elapsedTime = getElapsedTime();
  const formattedTime = formatTime(elapsedTime);
  
  if (displayElement.textContent !== formattedTime) {
    displayElement.textContent = formattedTime;
  }
}

/**
 * Formats time to always show one decimal place.
 */
function formatTime(seconds) {
  // Format time to always show one decimal place
  return seconds.toFixed(1).padStart(4, '0');
}

// ... (other timer-related functions)
