/**
 * Main script file for the game application.
 * Imports necessary modules and sets up event listeners.
 */

import { initializeGame } from "./modules/game.js";
import { handleKeyPress } from "./modules/input.js";
import { toggleColor, toggleFont, toggleCase } from "./modules/ui.js";
import { toggleBackgroundMusic, initAudio, startBackgroundMusic } from "./modules/audio.js";
import { showHistory, showStats, setupModalClosers } from "./modules/modals.js";
import { handleMobileKeyboard, showMobileKeyboard } from "./modules/mobile.js";

/**
 * Initializes the game and sets up event listeners when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
  setupEventListeners();
  handleMobileKeyboard();
  setupModalClosers();

  // Initialize audio, start background music, and show mobile keyboard on first user interaction
  const startAudioAndFullscreen = () => {
    initAudio();
    startBackgroundMusic();
    requestFullScreen();
    showMobileKeyboard();
    document.removeEventListener("click", startAudioAndFullscreen);
    document.removeEventListener("touchstart", startAudioAndFullscreen);
    document.removeEventListener("keydown", startAudioAndFullscreen);
  };

  document.addEventListener("click", startAudioAndFullscreen, { once: true });
  document.addEventListener("touchstart", startAudioAndFullscreen, { once: true });
  document.addEventListener("keydown", startAudioAndFullscreen, { once: true });

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
  // Remove the keydown event listener from here
  // document.addEventListener("keydown", handleKeyPress);

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

  // Replace the existing keydown event listener with this:
  document.addEventListener("keydown", (event) => {
    if (window.mobileInputElement && document.activeElement === window.mobileInputElement) {
      // Handle mobile input
      handleMobileInput({ key: event.key });
    } else {
      // Handle desktop input
      handleKeyPress(event);
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

// Add this function to the script.js file
function requestFullScreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen().catch((err) => {
      console.warn("Error attempting to enable full-screen mode:", err);
    });
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
