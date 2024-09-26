/**
 * Array of predefined colors for use in the application.
 * These colors are carefully selected to provide a visually pleasing palette.
 */
const NICE_COLORS = Object.freeze([
  "#D32F2F", "#C2185B", "#7B1FA2", "#512DA8", "#303F9F",
  "#1976D2", "#0288D1", "#0097A7", "#00796B", "#388E3C",
  "#689F38", "#AFB42B", "#FBC02D", "#FFA000", "#F57C00",
]);

/**
 * Returns a random color from the predefined color array.
 * @returns {string} A randomly selected color in hexadecimal format.
 */
export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * NICE_COLORS.length);
  return NICE_COLORS[randomIndex];
}

// ... (other utility functions)