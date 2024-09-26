from flask import Flask, render_template, jsonify, session, request
from typing import Dict, List, Any
import random
import os
import time
import yaml

app = Flask(__name__, static_folder="static", static_url_path='/static')
app.secret_key = os.environ.get(
    "SECRET_KEY", "default_secret_key"
)  # Use environment variable or a default


def load_emoji_dict() -> Dict[str, List[Dict[str, str]]]:
    """
    Loads the emoji dictionary from the YAML file.

    :return: A dictionary containing emojis for each letter.
    """
    with open("emojis.yaml", "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


emoji_dict: Dict[str, List[Dict[str, str]]] = load_emoji_dict()


def get_random_emoji(letter: str) -> Dict[str, str]:
    """
    Retrieves a random emoji and its name for the given letter.

    :params letter: The letter for which to get the emoji.
    :return: A dictionary containing the emoji and its name.
    """
    chosen_emoji: Dict[str, str] = random.choice(
        emoji_dict.get(letter.upper(), [{"emoji": "❓", "name": "Question"}])
    )
    return chosen_emoji


@app.route("/")
def index() -> str:
    """
    Renders the main page and initializes session variables.

    :return: Rendered HTML template for the main page.
    """
    session["history"] = []
    session["current_letter"] = ""
    return render_template("alphabet.html")


@app.route("/get_random_letter")
def get_random_letter() -> Any:
    """
    Generates a random letter and its associated emoji, updates history.

    :return: JSON containing the random letter and emoji information.
    """
    history: List[Dict[str, Any]] = session.get("history", [])
    current_letter: str = session.get("current_letter", "")

    available_letters: List[str] = [
        chr(i) for i in range(65, 91) if chr(i) != current_letter
    ]

    letter: str = random.choice(available_letters)
    emoji_data: Dict[str, str] = get_random_emoji(letter)
    timestamp: int = int(time.time())
    
    result: Dict[str, Any] = {
        "letter": letter,
        "emoji": emoji_data["emoji"],
        "emoji_name": emoji_data["name"],
        "display_text": f"{letter} is for {emoji_data['name']}",
        "timestamp": timestamp,
    }

    history.append(
        {
            "letter": letter,
            "emoji": emoji_data["emoji"],
            "emoji_name": emoji_data["name"],
            "timestamp": timestamp,
            "error": 0,
            "time_taken": None,  # We'll update this when the task is completed
        }
    )
    session["history"] = history[-99:]  # Keep the last 99 entries
    session["current_letter"] = letter

    return jsonify(result)

@app.route("/update_time_taken", methods=["POST"])
def update_time_taken() -> Any:
    """
    Updates the time taken for the current letter task.

    :return: JSON response indicating success.
    """
    data: Dict[str, Any] = request.get_json()
    letter: str = data.get("letter", "").upper()
    time_taken: float = data.get("time_taken", 0)
    
    history: List[Dict[str, Any]] = session.get("history", [])

    for item in reversed(history):
        if item["letter"] == letter and item["time_taken"] is None:
            item["time_taken"] = time_taken
            break

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
            item["error"] += 1
            break
    session["history"] = history

    return jsonify({"status": "success"})


@app.route("/get_history")
def get_history() -> Any:
    """
    Retrieves the history of letters and emojis.

    :return: JSON containing the history list.
    """
    history: List[Dict[str, Any]] = session.get("history", [])
    return jsonify(history)


@app.route("/get_statistics")
def get_statistics() -> Any:
    """
    Computes and retrieves statistics based on history.

    :return: JSON containing statistics data.
    """
    history: List[Dict[str, Any]] = session.get("history", [])
    total_attempts: int = len(history)
    total_errors: int = sum(item.get("error", 0) for item in history)
    accuracy: float = (
        ((total_attempts - total_errors) / total_attempts) * 100
        if total_attempts > 0
        else 0.0
    )

    stats: Dict[str, Any] = {
        "total_attempts": total_attempts,
        "total_errors": total_errors,
        "accuracy": round(accuracy, 2),
    }

    return jsonify(stats)


if __name__ == "__main__":
    app.run()
