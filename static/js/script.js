/**
 * Main script file for the game application.
 * Imports necessary modules and sets up event listeners.
 */

import { initializeGame } from "./modules/game.js";
import { handleKeyPress } from "./modules/input.js";
import { toggleColor, toggleFont, toggleCase } from "./modules/ui.js";
import { toggleBackgroundMusic, initAudio } from "./modules/audio.js";
import { showHistory, showStats, setupModalClosers } from "./modules/modals.js";
import { handleMobileKeyboard } from "./modules/mobile.js";

/**
 * Initializes the game and sets up event listeners when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
  setupEventListeners();
  handleMobileKeyboard();
  setupModalClosers();

  // Initialize audio on first user interaction
  document.addEventListener("click", initAudio, { once: true });
  document.addEventListener("keydown", initAudio, { once: true });

  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.body.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
  document.addEventListener("contextmenu", (e) => e.preventDefault());
});

/**
 * Sets up event listeners for various game controls and buttons.
 */
function setupEventListeners() {
  document.addEventListener("keydown", handleKeyPress);

  const buttonHandlers = [
    { id: "colorToggleBtn", handler: toggleColor },
    { id: "fontToggleBtn", handler: toggleFont },
    { id: "musicToggleBtn", handler: toggleBackgroundMusic },
    { id: "historyBtn", handler: showHistory },
    { id: "statsBtn", handler: showStats },
    { id: "caseToggleBtn", handler: toggleCase },
  ];

  buttonHandlers.forEach(({ id, handler }) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", handler);
    } else {
      console.warn(`Button with id '${id}' not found`);
    }
  });
}

/**
 * Handles visibility changes to manage audio context and background music.
 */
function handleVisibilityChange() {
  if (document.hidden) {
    window.audioContext?.suspend();
  } else {
    if (window.audioContext?.state === "suspended") {
      window.audioContext.resume();
    }
    window.backgroundMusic?.resume();
  }
}

/**
 * Handles touch start events to resume audio context and background music.
 */
function handleTouchStart() {
  if (window.audioContext?.state === "suspended") {
    window.audioContext.resume();
  }
  window.backgroundMusic?.resume();
}
