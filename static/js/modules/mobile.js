import { handleKeyPress } from "./input.js";  // Make sure this import is correct

// Add this function at the beginning of the file
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Call this function initially and on resize
window.addEventListener("resize", setVH);
window.addEventListener("orientationchange", setVH);
setVH();

/**
 * Sets up mobile-specific functionality and handles device-specific adjustments.
 */
export function handleMobileKeyboard() {
  setVH(); // Add this line
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const fullscreenToggleBtn = document.getElementById("fullscreenToggleBtn");
  const gameContainer = document.getElementById("game-container");
  const showKeyboardBtn = document.getElementById("showKeyboardBtn");

  if (isMobile) {
    setupMobileInterface(gameContainer, showKeyboardBtn);
    // Add this line to make mobileInputElement globally accessible
    window.mobileInputElement = mobileInputElement;
  } else {
    setupDesktopInterface(showKeyboardBtn, fullscreenToggleBtn);
  }
  disableBrowserHotkeys();
}

/**
 * Configures the interface for mobile devices.
 * @param {HTMLElement} gameContainer - The main game container element.
 * @param {HTMLElement} showKeyboardBtn - The button to show the keyboard.
 */
function setupMobileInterface(gameContainer, showKeyboardBtn) {
  if (showKeyboardBtn) {
    showKeyboardBtn.style.display = "block";
    showKeyboardBtn.addEventListener("click", toggleMobileKeyboard);
  }

  mobileInputElement = createMobileKeyboardInput();
  document.body.appendChild(mobileInputElement);

  mobileInputElement.addEventListener("input", handleMobileInput);
  mobileInputElement.addEventListener("focus", () =>
    adjustForKeyboard(gameContainer)
  );
  mobileInputElement.addEventListener("blur", () =>
    adjustForKeyboard(gameContainer)
  );

  // Use visualViewport API for more reliable keyboard detection
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () =>
      adjustForKeyboard(gameContainer)
    );
  } else {
    window.addEventListener("resize", () => adjustForKeyboard(gameContainer));
  }

  if (fullscreenToggleBtn) fullscreenToggleBtn.style.display = "none";

  // Add this line to call adjustForKeyboard immediately
  adjustForKeyboard(gameContainer);
}

/**
 * Creates and configures the mobile keyboard input element.
 * @returns {HTMLInputElement} The configured input element.
 */
function createMobileKeyboardInput() {
  const input = document.createElement("input");
  Object.assign(input, {
    type: "password",
    id: "mobileInput",
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: false,
    inputmode: "text",
    lang: "en",
  });
  Object.assign(input.style, {
    position: "fixed",
    top: "-100px", // Move it off-screen
    left: "0",
    opacity: "0", // Make it invisible
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    backgroundColor: "transparent",
  });
  return input;
}

/**
 * Handles input events for the mobile keyboard.
 * @param {Event} event - The input event.
 */
function handleMobileInput(event) {
  const inputChar = event.key || event.target.value;
  if (inputChar) {
    handleKeyPress({ key: inputChar.toLowerCase() });
  }
  if (event.target && event.target.value) {
    event.target.value = "";
  }
}

function toggleMobileKeyboard() {
  const mobileInput = document.getElementById("mobileInput");
  const showKeyboardBtn = document.getElementById("showKeyboardBtn");

  if (mobileInput) {
    if (document.activeElement === mobileInput) {
      mobileInput.blur();
    } else {
      mobileInput.focus();
      mobileInput.lang = "en";
    }
  }
}

function requestFullScreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen().catch((err) => {
      console.warn("Error attempting to enable full-screen mode:", err);
    });
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
}

// Remove or comment out this function as it's no longer needed
// function requestFullScreenOnFirstKey(event) {
//   requestFullScreen();
//   document.removeEventListener("keydown", requestFullScreenOnFirstKey);
// }

/**
 * Configures the interface for desktop devices.
 * @param {HTMLElement} showKeyboardBtn - The button to show the keyboard.
 * @param {HTMLElement} fullscreenToggleBtn - The button to toggle fullscreen mode.
 */
function setupDesktopInterface(showKeyboardBtn, fullscreenToggleBtn) {
  if (showKeyboardBtn) showKeyboardBtn.style.display = "none";

  document.addEventListener("keydown", handleKeyPressWithPrevention);

  if (fullscreenToggleBtn) {
    fullscreenToggleBtn.style.display = "block";
    fullscreenToggleBtn.addEventListener("click", toggleFullscreen);
  }
}

/**
 * Handles key press events with prevention of default browser behavior.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyPressWithPrevention(event) {
  // Prevent default behavior for all keys except F11 (fullscreen)
  if (event.key !== "F11") {
    event.preventDefault();
  }
  handleKeyPress(event);
}

/**
 * Disables common browser hotkeys.
 */
function disableBrowserHotkeys() {
  document.addEventListener(
    "keydown",
    (event) => {
      // Allow F11 for fullscreen toggle
      if (event.key === "F11") return;

      // Prevent default for most common hotkeys
      if (
        (event.ctrlKey &&
          (event.key === "n" || // New window
            event.key === "t" || // New tab
            event.key === "w" || // Close tab
            event.key === "f" || // Find
            event.key === "p" || // Print
            event.key === "s" || // Save
            event.key === "o" || // Open
            event.key === "+" || // Zoom in
            event.key === "-" || // Zoom out
            event.key === "0")) || // Reset zoom
        (event.altKey && event.key === "Home") || // Home page
        event.key === "F5" || // Refresh
        event.key === "Escape" // Escape key
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  // Disable context menu
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  // Disable selection
  document.addEventListener("selectstart", (event) => {
    event.preventDefault();
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    requestFullScreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function adjustForKeyboard(gameContainer) {
  setVH();
  const viewportHeight = window.innerHeight;
  const cardContainer = document.getElementById("card-container");
  const sentenceContainer = document.getElementById("sentence-container");
  const letterContainer = document.getElementById("letter-container");
  const feedback = document.getElementById("feedback");
  const emojiDisplay = document.getElementById("emoji-display");

  setTimeout(() => {
    const isKeyboardVisible =
      window.visualViewport.height < viewportHeight * 0.8;
    const availableHeight = window.visualViewport.height;
    const newSize = isKeyboardVisible
      ? Math.min(65, Math.max(50, (availableHeight / viewportHeight) * 65))
      : 65;

    cardContainer.style.width = `${newSize}vw`;
    cardContainer.style.height = `${newSize}vw`;

    // Adjust the top margin of the card container
    cardContainer.style.marginTop = isKeyboardVisible ? '6vh' : '18vh';

    emojiDisplay.style.fontSize = `${
      isKeyboardVisible ? Math.max(25, newSize * 0.5) : 35
    }vw`;
    emojiDisplay.style.top = isKeyboardVisible
      ? "calc(50% + 5px)"
      : "calc(50% + 10px)";
    emojiDisplay.style.height = isKeyboardVisible
      ? "calc(100% - 20px)"
      : "calc(100% - 40px)";

    gameContainer.style.height = `${availableHeight}px`;
    gameContainer.style.padding = isKeyboardVisible
      ? "1vh 3vw 0.5vh"
      : "2vh 3vw 1vh";

    Object.assign(sentenceContainer.style, {
      fontSize: isKeyboardVisible
        ? "clamp(12px, 3vw, 18px)"
        : "clamp(16px, 4vw, 24px)",
      minHeight: isKeyboardVisible ? "1.2rem" : "1.5rem",
      marginBottom: "1vh",
    });

    Object.assign(letterContainer.style, {
      height: isKeyboardVisible ? "6vh" : "10vh",
      width: isKeyboardVisible ? "94vw" : "90vw",
    });

    Object.assign(feedback.style, {
      fontSize: isKeyboardVisible
        ? "clamp(12px, 3vw, 18px)"
        : "clamp(16px, 4vw, 24px)",
      height: isKeyboardVisible ? "1.2rem" : "1.5rem",
    });

    Object.assign(cardContainer.style, {
      position: "relative",
      aspectRatio: "1 / 1",
    });

    // Force a repaint
    cardContainer.offsetHeight;
    emojiDisplay.offsetHeight;
  }, 100);
}

export function showMobileKeyboard() {
  if (mobileInputElement && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    mobileInputElement.focus();
    mobileInputElement.lang = "en";
  }
}
