import { getRandomColor } from "./utils.js";

// UI state variables
let isRainbow = true;
let currentColor;
const fonts = ["font-fredoka", "font-comic", "font-indie", "font-schoolbell"];
const fontEmojis = ["🔤", "🖋️", "✏️", "📚"];
let currentFontIndex = 0;

const cases = ["uppercase", "lowercase"];
let currentCaseIndex = 0;

// Add these lines at the beginning of the file
const emojiStyles = ["system", "twemoji"];
let currentEmojiStyleIndex = 0;

// Add this new function
export function toggleEmojiStyle() {
  const emojiStyleToggleBtn = document.getElementById("emojiStyleToggleBtn");
  currentEmojiStyleIndex = (currentEmojiStyleIndex + 1) % emojiStyles.length;
  const currentStyle = emojiStyles[currentEmojiStyleIndex];

  if (emojiStyleToggleBtn) {
    const config = {
      system: { text: "📱", label: "Switch to Twitter emoji style" },
      twemoji: { text: "🐦", label: "Switch to system emoji style" },
    };
    const { text, label } = config[currentStyle];
    emojiStyleToggleBtn.textContent = text;
    emojiStyleToggleBtn.setAttribute("aria-label", label);
  }

  // Apply the new emoji style
  document.body.dataset.emojiStyle = currentStyle;
}

/**
 * Toggles between rainbow and gray color modes for the display text.
 */
export function toggleColor() {
  isRainbow = !isRainbow;
  const displayText = document.getElementById("display-text");
  const colorToggleBtn = document.getElementById("colorToggleBtn");

  if (displayText) {
    displayText.style.color = isRainbow ? getRandomColor() : "#333333";
  }

  if (colorToggleBtn) {
    const [text, label] = isRainbow
      ? ["🔳", "Switch to gray color"]
      : ["🌈", "Switch to colored text"];
    colorToggleBtn.textContent = text;
    colorToggleBtn.setAttribute("aria-label", label);
  }
}

/**
 * Cycles through available fonts for the display elements.
 */
export function toggleFont() {
  const elements = [
    document.getElementById("display-text"),
    document.getElementById("letter-display"),
    document.getElementById("previous-letter"),
    document.getElementById("next-letter"),
    document.getElementById("timer")
  ];
  const fontToggleBtn = document.getElementById("fontToggleBtn");

  if (elements.every(Boolean)) {
    elements.forEach((el) => {
      fonts.forEach((font) => el.classList.remove(font));
    });
    currentFontIndex = (currentFontIndex + 1) % fonts.length;
    elements.forEach((el) => {
      el.classList.add(fonts[currentFontIndex]);
    });
  }

  if (fontToggleBtn) {
    fontToggleBtn.textContent = fontEmojis[currentFontIndex];
    const nextFontIndex = (currentFontIndex + 1) % fonts.length;
    fontToggleBtn.setAttribute(
      "aria-label",
      `Switch to ${fonts[nextFontIndex].replace("font-", "")} font`
    );
  }
}

/**
 * Toggles between uppercase and lowercase display modes.
 */
export function toggleCase() {
  const caseToggleBtn = document.getElementById("caseToggleBtn");
  currentCaseIndex = (currentCaseIndex + 1) % cases.length;
  const currentCase = cases[currentCaseIndex];

  if (caseToggleBtn) {
    const config = {
      uppercase: { text: "AA", label: "Switch to lowercase" },
      lowercase: { text: "aa", label: "Switch to uppercase" },
    };
    const { text, label } = config[currentCase];
    caseToggleBtn.textContent = text;
    caseToggleBtn.setAttribute("aria-label", label);
  }

  updateLetterCase();
}

/**
 * Updates the case of displayed letters based on the current case setting.
 */
function updateLetterCase() {
  const elements = [
    document.getElementById("letter-display"),
    document.getElementById("previous-letter"),
    document.getElementById("next-letter"),
  ];

  if (elements.every(Boolean)) {
    const currentCase = cases[currentCaseIndex];
    elements.forEach((element) => {
      if (currentCase === "uppercase") {
        element.textContent = element.textContent.toUpperCase();
      } else {
        element.textContent = element.textContent.toLowerCase();
      }
    });
  }
}

/**
 * Updates the display with new letter data.
 * @param {Object} previousLetterData - Data for the previous letter.
 * @param {Object} currentLetterData - Data for the current letter.
 * @param {Object} nextLetterData - Data for the next letter.
 */
export function updateDisplay(
  previousLetterData,
  currentLetterData,
  nextLetterData
) {
  const elements = {
    previousLetter: document.getElementById("previous-letter"),
    letterDisplay: document.getElementById("letter-display"),
    nextLetter: document.getElementById("next-letter"),
    emojiDisplay: document.getElementById("emoji-display"),
    displayText: document.getElementById("display-text"),
    feedback: document.getElementById("feedback"),
  };

  elements.previousLetter.textContent = previousLetterData?.letter || "";
  elements.letterDisplay.textContent = currentLetterData?.letter || "";
  elements.nextLetter.textContent = nextLetterData?.letter || "";
  elements.emojiDisplay.textContent = currentLetterData?.emoji || "";
  elements.displayText.textContent = currentLetterData?.displayText || "";

  if (currentLetterData) {
    elements.letterDisplay.dataset.originalLetter = currentLetterData.letter;
  } else {
    delete elements.letterDisplay.dataset.originalLetter;
  }

  elements.feedback.textContent = "";
  elements.letterDisplay.style.color = "#4a4a4a";

  if (isRainbow) {
    currentColor = getRandomColor();
    elements.displayText.style.color = currentColor;
  } else {
    elements.displayText.style.color = "#333333";
  }

  updateLetterCase();
}
