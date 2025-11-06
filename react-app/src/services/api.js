/**
 * API Service Layer
 *
 * WHAT: This file contains functions to communicate with the Flask backend API
 *
 * WHY: Separating API calls into a dedicated service layer makes code more organized
 * and reusable. Instead of writing fetch() in every component, we centralize it here.
 *
 * LEARNING NOTES:
 * - This is the "Service Layer Pattern" - a common way to organize API calls
 * - We use async/await for handling asynchronous operations (API calls take time!)
 * - Each function handles errors gracefully and returns useful data
 * - The API_BASE_URL can be easily changed for different environments
 */

// Base URL for the Flask backend
// LEARNING: We use localhost:5000 for development. In production, this would be your server URL
const API_BASE_URL = 'http://localhost:5000';

/**
 * Gets a random letter and emoji from the server
 *
 * WHAT: Fetches a random letter (A-Z) with its matching emoji
 *
 * HOW IT WORKS:
 * 1. Send HTTP GET request to /get_random_letter
 * 2. Wait for response (await)
 * 3. Convert response to JSON
 * 4. Return the letter data
 *
 * @returns {Promise<Object>} Object with { letter, emoji, displayText }
 *
 * LEARNING NOTES:
 * - async function: allows us to use 'await' keyword
 * - await: waits for the promise to resolve before continuing
 * - try/catch: handles errors gracefully instead of crashing
 * - fetch(): built-in browser API for making HTTP requests
 */
export async function getRandomLetter() {
  try {
    // Make the API call
    // LEARNING: fetch() returns a Promise, so we use 'await' to wait for it
    const response = await fetch(`${API_BASE_URL}/get_random_letter`);

    // Check if the request was successful
    // LEARNING: HTTP status 200-299 means success
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    // LEARNING: response.json() also returns a Promise, so we await it too
    const data = await response.json();

    return data;
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching random letter:', error);

    // Return null so the calling code knows something went wrong
    // LEARNING: Always handle errors! Don't let your app crash silently
    return null;
  }
}

/**
 * Updates the game history on the server
 *
 * WHAT: Sends information about a correctly typed letter to the backend
 *
 * WHY: We want to track the user's progress and time taken for each letter
 *
 * @param {string} letter - The letter that was typed (e.g., "A")
 * @param {number} timeTaken - How long it took in seconds
 * @param {string} emoji - The emoji shown (e.g., "🍎")
 * @param {string} emojiName - The emoji's name (e.g., "Apple")
 *
 * LEARNING NOTES:
 * - POST request: sends data TO the server (vs GET which retrieves data)
 * - Headers: tell the server what format we're sending (JSON)
 * - Body: the actual data we're sending (must be stringified JSON)
 */
export async function updateHistory(letter, timeTaken, emoji, emojiName) {
  try {
    const response = await fetch(`${API_BASE_URL}/update_history`, {
      method: 'POST', // LEARNING: POST is used to send data to the server
      headers: {
        // Tell the server we're sending JSON data
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // LEARNING: JSON.stringify converts JavaScript object to JSON string
        letter,
        time_taken: timeTaken, // Note: backend uses snake_case
        emoji,
        emoji_name: emojiName,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating history:', error);
    return null;
  }
}

/**
 * Reports an incorrect key press to the server
 *
 * WHAT: Tells the backend when a user makes a mistake
 *
 * WHY: We track errors to show which letters the user struggles with
 *
 * @param {string} letter - The letter the user tried to type
 *
 * LEARNING NOTES:
 * - Similar pattern to updateHistory (POST request with JSON)
 * - Notice how we reuse the same error handling pattern
 * - This is why separating API calls into a service layer is good!
 */
export async function reportError(letter) {
  try {
    const response = await fetch(`${API_BASE_URL}/report_error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ letter }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error reporting error:', error);
    return null;
  }
}

/**
 * Gets the user's game history from the server
 *
 * WHAT: Retrieves the list of all letters the user has typed
 *
 * WHY: To display in the history modal
 *
 * @returns {Promise<Array>} Array of history entries
 *
 * LEARNING NOTES:
 * - GET request: we're retrieving data, not sending it
 * - Returns an array of objects, each representing one letter attempt
 */
export async function getHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/get_history`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // LEARNING: The backend returns an array, but we check to make sure
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching history:', error);

    // Return empty array instead of null for easier handling
    // LEARNING: Returning [] means calling code can safely use .map() without checking for null
    return [];
  }
}

/**
 * Gets game statistics from the server
 *
 * WHAT: Retrieves calculated statistics like average time, most common errors, etc.
 *
 * WHY: To display in the statistics modal
 *
 * @returns {Promise<Object>} Statistics object
 */
export async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/get_statistics`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);

    // Return empty stats object as fallback
    return {
      totalAttempts: 0,
      averageTime: 0,
      errorRate: 0,
    };
  }
}

/**
 * Clears the user's game history
 *
 * WHAT: Resets all history and statistics on the server
 *
 * WHY: Allows user to start fresh
 *
 * LEARNING NOTES:
 * - POST request even though we're not sending data (we're triggering an action)
 * - Some APIs use DELETE method for this, but POST works fine too
 */
export async function clearHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/clear_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error clearing history:', error);
    return null;
  }
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts in This File:
 * 1. Service Layer Pattern: Centralize API calls in one place
 * 2. Async/Await: Handle asynchronous operations cleanly
 * 3. Error Handling: Always use try/catch for API calls
 * 4. HTTP Methods: GET (retrieve), POST (send/create), DELETE (remove)
 * 5. JSON: Standard data format for APIs (must stringify when sending!)
 * 6. Consistent Returns: Each function returns a predictable data type
 *
 * Best Practices:
 * - Always handle errors gracefully
 * - Check response.ok before parsing
 * - Return sensible fallback values (null, [], {})
 * - Use descriptive function and variable names
 * - Add JSDoc comments for documentation
 *
 * Try This:
 * - Add console.log() before and after API calls to see the flow
 * - Try calling these functions from your browser console
 * - Look at the Network tab in DevTools to see the actual HTTP requests
 */
