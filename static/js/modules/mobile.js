import { handleKeyPress } from './game.js';

/**
 * Sets up mobile-specific functionality and handles device-specific adjustments.
 */
export function handleMobileKeyboard() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const fullscreenToggleBtn = document.getElementById("fullscreenToggleBtn");
  const gameContainer = document.getElementById("game-container");
  const showKeyboardBtn = document.getElementById("showKeyboardBtn");

  if (isMobile) {
    setupMobileInterface(gameContainer, showKeyboardBtn);
  } else {
    setupDesktopInterface(showKeyboardBtn, fullscreenToggleBtn);
  }
}

/**
 * Configures the interface for mobile devices.
 * @param {HTMLElement} gameContainer - The main game container element.
 * @param {HTMLElement} showKeyboardBtn - The button to show the keyboard.
 */
function setupMobileInterface(gameContainer, showKeyboardBtn) {
  if (showKeyboardBtn) showKeyboardBtn.style.display = "block";

  const keyboardInput = createMobileKeyboardInput();
  document.body.appendChild(keyboardInput);

  keyboardInput.addEventListener("input", handleMobileInput);

  window.addEventListener("load", () => keyboardInput.focus());
  window.addEventListener("resize", () => adjustForKeyboard(gameContainer));

  if (fullscreenToggleBtn) fullscreenToggleBtn.style.display = "none";
}

/**
 * Creates and configures the mobile keyboard input element.
 * @returns {HTMLInputElement} The configured input element.
 */
function createMobileKeyboardInput() {
  const input = document.createElement("input");
  Object.assign(input, {
    type: "text",
    id: "mobileInput",
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: false,
  });
  Object.assign(input.style, {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderTop: "1px solid #ccc",
    backgroundColor: "#f8f8f8",
  });
  return input;
}

/**
 * Handles input events for the mobile keyboard.
 * @param {Event} event - The input event.
 */
function handleMobileInput(event) {
  const inputChar = event.target.value.toLowerCase();
  event.target.value = "";
  handleKeyPress({ key: inputChar });
}

/**
 * Adjusts the game container position when the mobile keyboard appears.
 * @param {HTMLElement} gameContainer - The main game container element.
 */
function adjustForKeyboard(gameContainer) {
  const viewportHeight = window.innerHeight;
  const keyboardHeight = viewportHeight - document.documentElement.clientHeight;
  
  gameContainer.style.transform = keyboardHeight > 0 
    ? `translateY(-${keyboardHeight}px)` 
    : "";
}

/**
 * Configures the interface for desktop devices.
 * @param {HTMLElement} showKeyboardBtn - The button to show the keyboard.
 * @param {HTMLElement} fullscreenToggleBtn - The button to toggle fullscreen mode.
 */
function setupDesktopInterface(showKeyboardBtn, fullscreenToggleBtn) {
  if (showKeyboardBtn) showKeyboardBtn.style.display = "none";

  document.addEventListener("keydown", handleKeyPress);

  if (fullscreenToggleBtn) {
    fullscreenToggleBtn.style.display = "block";
    fullscreenToggleBtn.addEventListener("click", toggleFullscreen);
  }
}

/**
 * Toggles fullscreen mode for the document.
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((e) => {
      console.error(`Error attempting to enable fullscreen: ${e.message}`);
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}