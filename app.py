from flask import Flask, render_template, jsonify, session, request
from typing import Dict, List, Any
import os
from src.game_logic import generate_random_letter, create_letter_result
from src.game_statistics import calculate_statistics
import time

app = Flask(__name__, static_folder="static", static_url_path="/static")
app.secret_key = os.environ.get(
    "SECRET_KEY", "default_secret_key"
)  # Use environment variable or a default


@app.route("/")
def index() -> str:
    """
    Renders the main page and initializes session variables if they don't exist.

    :return: Rendered HTML template for the main page.
    """
    if "history" not in session:
        session["history"] = []
    if "current_letter" not in session:
        session["current_letter"] = ""
    return render_template("alphabet.html")


@app.route("/get_random_letter")
def get_random_letter() -> Any:
    """
    Generates a random letter and its associated emoji, without updating history.

    :return: JSON containing the random letter and emoji information.
    """
    current_letter: str = session.get("current_letter", "")

    letter: str = generate_random_letter(current_letter)
    result: Dict[str, Any] = create_letter_result(letter)

    session["current_letter"] = letter

    return jsonify(result)


@app.route("/update_history", methods=["POST"])
def update_history_route() -> Any:
    """
    Updates the history with the current letter after a correct guess.

    :return: JSON response indicating success.
    """
    data: Dict[str, Any] = request.get_json()
    letter: str = data.get("letter", "").upper()
    time_taken: float = data.get("time_taken", 0)
    emoji: str = data.get("emoji", "")
    emoji_name: str = data.get("emoji_name", "")

    history: List[Dict[str, Any]] = session.get("history", [])

    # Check if the letter already exists in the history
    existing_entry = next((item for item in history if item["letter"] == letter), None)

    if existing_entry:
        # Update the existing entry
        existing_entry["time_taken"] = time_taken
        existing_entry["emoji"] = emoji
        existing_entry["emoji_name"] = emoji_name
        existing_entry["timestamp"] = int(time.time())
    else:
        # Add a new entry
        new_entry: Dict[str, Any] = {
            "letter": letter,
            "emoji": emoji,
            "emoji_name": emoji_name,
            "time_taken": time_taken,
            "error": 0,
            "timestamp": int(time.time()),
        }
        history.append(new_entry)

    # Limit history to last 100 items
    history = history[-100:]

    # Update the session
    session["history"] = history

    return jsonify({"status": "success"})


@app.route("/report_error", methods=["POST"])
def report_error() -> Any:
    """
    Reports an error for a specific letter input.

    :return: JSON response indicating success.
    """
    data: Dict[str, Any] = request.get_json()
    letter: str = data.get("letter", "").upper()
    history: List[Dict[str, Any]] = session.get("history", [])

    for item in history:
        if item["letter"] == letter:
            item["error"] = item.get("error", 0) + 1
            break
    else:
        # If the letter is not in the history, add a new entry
        history.append(
            {
                "letter": letter,
                "error": 1,
                "timestamp": int(time.time()),
            }
        )

    # Limit history to last 100 items
    history = history[-100:]

    session["history"] = history

    return jsonify({"status": "success"})


@app.route("/get_history")
def get_history() -> Any:
    """
    Retrieves the history of letters and emojis in reverse order (most recent first).

    :return: JSON containing the reversed history list.
    """
    history: List[Dict[str, Any]] = session.get("history", [])
    return jsonify(list(reversed(history)))


@app.route("/get_statistics")
def get_statistics() -> Any:
    """
    Computes and retrieves statistics based on history.

    :return: JSON containing statistics data.
    """
    history: List[Dict[str, Any]] = session.get("history", [])
    stats: Dict[str, Any] = calculate_statistics(history)
    return jsonify(stats)


@app.route("/clear_history", methods=["POST"])
def clear_history() -> Any:
    """
    Clears the user's history.

    :return: JSON response indicating success.
    """
    session["history"] = []
    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run()
