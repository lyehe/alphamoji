/**
 * Fetches a random letter from the server.
 * @returns {Promise<{letter: string, emoji: string, displayText: string} | null>} The letter data or null if an error occurs.
 */
export async function getRandomLetter() {
  try {
    const response = await fetch("/get_random_letter");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      letter: data.letter,
      emoji: data.emoji,
      displayText: data.display_text,
    };
  } catch (error) {
    console.error("Error fetching random letter:", error);
    return null;
  }
}

/**
 * Reports an error for a specific letter to the server.
 * @param {string} letter - The letter that caused the error.
 * @returns {Promise<void>}
 */
export async function reportError(letter) {
  try {
    await fetch("/report_error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ letter }),
    });
  } catch (error) {
    console.error("Error reporting letter error:", error);
  }
}

export async function updateTimeTaken(letter, timeTaken) {
  try {
    await fetch("/update_time_taken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ letter, time_taken: timeTaken }),
    });
  } catch (error) {
    console.error("Error updating time taken:", error);
  }
}
