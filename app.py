from flask import Flask, render_template, jsonify, session, request
from typing import Dict, List, Any
import random
import os
import time

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)


def get_random_emoji(letter: str) -> Dict[str, str]:
    """
    Retrieves a random emoji and its name for the given letter.

    :params letter: The letter for which to get the emoji.
    :return: A dictionary containing the emoji and its name.
    """
    emoji_dict: Dict[str, List[Dict[str, str]]] = {
        "A": [
            {"emoji": "🍎", "name": "Apple"},
            {"emoji": "✈️", "name": "Airplane"},
            {"emoji": "👽", "name": "Alien"},
            {"emoji": "🐜", "name": "Ant"},
            {"emoji": "🚑", "name": "Ambulance"},
            {"emoji": "🎨", "name": "Artist"},
            {"emoji": "🍏", "name": "Avocado"},
        ],
        "B": [
            {"emoji": "🍌", "name": "Banana"},
            {"emoji": "🐻", "name": "Bear"},
            {"emoji": "🎈", "name": "Balloon"},
            {"emoji": "🦋", "name": "Butterfly"},
            {"emoji": "🍞", "name": "Bread"},
            {"emoji": "🦇", "name": "Bat"},
            {"emoji": "🏀", "name": "Basketball"},
            {"emoji": "🚲", "name": "Bike"},
        ],
        "C": [
            {"emoji": "🍪", "name": "Cookie"},
            {"emoji": "🐱", "name": "Cat"},
            {"emoji": "🤠", "name": "Cowboy"},
            {"emoji": "🎪", "name": "Circus"},
            {"emoji": "🐄", "name": "Cow"},
            {"emoji": "🥕", "name": "Carrot"},
            {"emoji": "🍰", "name": "Cake"},
            {"emoji": "🚗", "name": "Car"},
        ],
        "D": [
            {"emoji": "🦕", "name": "Dinosaur"},
            {"emoji": "🐶", "name": "Dog"},
            {"emoji": "🍩", "name": "Donut"},
            {"emoji": "🐬", "name": "Dolphin"},
            {"emoji": "💃", "name": "Dancer"},
            {"emoji": "🎲", "name": "Dice"},
            {"emoji": "🚚", "name": "Delivery Truck"},
            {"emoji": "🎻", "name": "Drum"},
        ],
        "E": [
            {"emoji": "🐘", "name": "Elephant"},
            {"emoji": "🥚", "name": "Egg"},
            {"emoji": "👁️", "name": "Eye"},
            {"emoji": "🦅", "name": "Eagle"},
            {"emoji": "🎧", "name": "Earphones"},
            {"emoji": "🧝", "name": "Elf"},
            {"emoji": "👀", "name": "Eyes"},
            {"emoji": "🦋", "name": "Ember"},
            {"emoji": "🍳", "name": "Eggs"},
        ],
        "F": [
            {"emoji": "🐸", "name": "Frog"},
            {"emoji": "🦊", "name": "Fox"},
            {"emoji": "🍟", "name": "Fries"},
            {"emoji": "🐠", "name": "Fish"},
            {"emoji": "🔥", "name": "Fire"},
            {"emoji": "🦩", "name": "Flamingo"},
            {"emoji": "🍇", "name": "Fruit"},
            {"emoji": "🎏", "name": "Flag"},
        ],
        "G": [
            {"emoji": "🦒", "name": "Giraffe"},
            {"emoji": "🍇", "name": "Grapes"},
            {"emoji": "🎸", "name": "Guitar"},
            {"emoji": "👻", "name": "Ghost"},
            {"emoji": "🦍", "name": "Gorilla"},
            {"emoji": "🧤", "name": "Gloves"},
            {"emoji": "🍔", "name": "Burger"},
            {"emoji": "🚦", "name": "Traffic Light"},
        ],
        "H": [
            {"emoji": "🐹", "name": "Hamster"},
            {"emoji": "🏠", "name": "House"},
            {"emoji": "🎩", "name": "Hat"},
            {"emoji": "🚁", "name": "Helicopter"},
            {"emoji": "🐴", "name": "Horse"},
            {"emoji": "🔨", "name": "Hammer"},
            {"emoji": "🦔", "name": "Hedgehog"},
            {"emoji": "🌺", "name": "Hibiscus"},
        ],
        "I": [
            {"emoji": "🍦", "name": "Icecream"},
            {"emoji": "🏝️", "name": "Island"},
            {"emoji": "🧊", "name": "Ice"},
            {"emoji": "🎯", "name": "Target"},
            {"emoji": "🍨", "name": "Ice Cream"},
            {"emoji": "🚲", "name": "Ice Skates"},
        ],
        "J": [
            {"emoji": "🤹", "name": "Juggler"},
            {"emoji": "🕹️", "name": "Joystick"},
            {"emoji": "🧃", "name": "Juice"},
            {"emoji": "👖", "name": "Jeans"},
            {"emoji": "🃏", "name": "Joker"},
            {"emoji": "🍏", "name": "Jar"},
            {"emoji": "🎷", "name": "Jazz"},
        ],
        "K": [
            {"emoji": "🪁", "name": "Kite"},
            {"emoji": "🔑", "name": "Key"},
            {"emoji": "🥝", "name": "Kiwi"},
            {"emoji": "👑", "name": "King"},
            {"emoji": "🦘", "name": "Kangaroo"},
            {"emoji": "🔪", "name": "Knife"},
            {"emoji": "🎤", "name": "Microphone"},
            {"emoji": "🚪", "name": "Knock"},
        ],
        "L": [
            {"emoji": "🦁", "name": "Lion"},
            {"emoji": "🍋", "name": "Lemon"},
            {"emoji": "🦎", "name": "Lizard"},
            {"emoji": "💡", "name": "Lamp"},
            {"emoji": "🍃", "name": "Leaf"},
            {"emoji": "🦙", "name": "Llama"},
            {"emoji": "🥬", "name": "Lettuce"},
            {"emoji": "🎬", "name": "Lights"},
        ],
        "M": [
            {"emoji": "🐒", "name": "Monkey"},
            {"emoji": "🌙", "name": "Moon"},
            {"emoji": "🍄", "name": "Mushroom"},
            {"emoji": "🧲", "name": "Magnet"},
            {"emoji": "🎭", "name": "Mask"},
            {"emoji": "🦟", "name": "Mosquito"},
            {"emoji": "🍔", "name": "Muffin"},
            {"emoji": "🚀", "name": "Mars"},
        ],
        "N": [
            {"emoji": "👃", "name": "Nose"},
            {"emoji": "🎶", "name": "Notes"},
            {"emoji": "🌃", "name": "Night"},
            {"emoji": "🪺", "name": "Nest"},
            {"emoji": "📰", "name": "Newspaper"},
            {"emoji": "🥜", "name": "Nut"},
            {"emoji": "🚲", "name": "Napkin"},
            {"emoji": "🎯", "name": "Needle"},
        ],
        "O": [
            {"emoji": "🐙", "name": "Octopus"},
            {"emoji": "🦉", "name": "Owl"},
            {"emoji": "🍊", "name": "Orange"},
            {"emoji": "🧅", "name": "Onion"},
            {"emoji": "🦦", "name": "Otter"},
            {"emoji": "🐍", "name": "Ophidian"},
            {"emoji": "🍦", "name": "Oreo"},
            {"emoji": "🎱", "name": "Pool"},
        ],
        "P": [
            {"emoji": "🐼", "name": "Panda"},
            {"emoji": "🍑", "name": "Peach"},
            {"emoji": "🥧", "name": "Pie"},
            {"emoji": "🦜", "name": "Parrot"},
            {"emoji": "🖊️", "name": "Pen"},
            {"emoji": "🥔", "name": "Potato"},
            {"emoji": "🎁", "name": "Present"},
            {"emoji": "🚍", "name": "Bus"},
        ],
        "Q": [
            {"emoji": "👸", "name": "Queen"},
            {"emoji": "🦆", "name": "Quack"},
            {"emoji": "🧸", "name": "Quilt"},
            {"emoji": "❓", "name": "Question"},
            {"emoji": "🎯", "name": "Quiver"},
            {"emoji": "🛴", "name": "Quadbike"},
        ],
        "R": [
            {"emoji": "🌈", "name": "Rainbow"},
            {"emoji": "🤖", "name": "Robot"},
            {"emoji": "🚀", "name": "Rocket"},
            {"emoji": "🌹", "name": "Rose"},
            {"emoji": "🐰", "name": "Rabbit"},
            {"emoji": "📻", "name": "Radio"},
            {"emoji": "🍚", "name": "Rice"},
            {"emoji": "🚗", "name": "Roadster"},
        ],
        "S": [
            {"emoji": "⭐", "name": "Star"},
            {"emoji": "🍓", "name": "Strawberry"},
            {"emoji": "☀️", "name": "Sun"},
            {"emoji": "🐿️", "name": "Squirrel"},
            {"emoji": "🦈", "name": "Shark"},
            {"emoji": "🧦", "name": "Socks"},
            {"emoji": "🎸", "name": "Guitar"},
            {"emoji": "🚲", "name": "Skateboard"},
        ],
        "T": [
            {"emoji": "🐯", "name": "Tiger"},
            {"emoji": "🌳", "name": "Tree"},
            {"emoji": "🍅", "name": "Tomato"},
            {"emoji": "🦃", "name": "Turkey"},
            {"emoji": "🚂", "name": "Train"},
            {"emoji": "🐢", "name": "Turtle"},
            {"emoji": "🎺", "name": "Trumpet"},
            {"emoji": "🚴", "name": "Bike"},
        ],
        "U": [
            {"emoji": "☂️", "name": "Umbrella"},
            {"emoji": "🦄", "name": "Unicorn"},
            {"emoji": "🛸", "name": "UFO"},
            {"emoji": "🧛", "name": "Undead"},
            {"emoji": "🦺", "name": "Uniform"},
            {"emoji": "🍇", "name": "Ugli Fruit"},
            {"emoji": "🚜", "name": "Uplift"},
            {"emoji": "🎯", "name": "Ultimate"},
        ],
        "V": [
            {"emoji": "🏐", "name": "Volleyball"},
            {"emoji": "🌋", "name": "Volcano"},
            {"emoji": "🚐", "name": "Van"},
            {"emoji": "🎻", "name": "Violin"},
            {"emoji": "🦺", "name": "Vest"},
            {"emoji": "🥕", "name": "Vegetable"},
            {"emoji": "🍷", "name": "Wine Glass"},
            {"emoji": "🚁", "name": "Vulture"},
        ],
        "W": [
            {"emoji": "🌊", "name": "Wave"},
            {"emoji": "🐺", "name": "Wolf"},
            {"emoji": "🍉", "name": "Watermelon"},
            {"emoji": "⌚", "name": "Watch"},
            {"emoji": "🪄", "name": "Wand"},
            {"emoji": "🧇", "name": "Waffle"},
            {"emoji": "🧙", "name": "Wizard"},
            {"emoji": "🐋", "name": "Whale"},
            {"emoji": "🎣", "name": "Fishing"},
        ],
        "X": [
            {"emoji": "❌", "name": "Xmark"},
            {"emoji": "🦓", "name": "Xerus"},
            {"emoji": "🎸", "name": "Xylophone"},
        ],
        "Y": [
            {"emoji": "🪀", "name": "Yoyo"},
            {"emoji": "🧒", "name": "Youth"},
            {"emoji": "🧘", "name": "Yoga"},
            {"emoji": "💛", "name": "Yellow"},
            {"emoji": "☯️", "name": "Yin Yang"},
            {"emoji": "🚲", "name": "Yacht"},
            {"emoji": "🍋", "name": "Yam"},
        ],
        "Z": [
            {"emoji": "🦓", "name": "Zebra"},
            {"emoji": "🧟", "name": "Zombie"},
            {"emoji": "💤", "name": "Zzz"},
            {"emoji": "⚡", "name": "Zap"},
            {"emoji": "🎷", "name": "Jazz"},
            {"emoji": "🚗", "name": "Zoomcar"},
        ],
    }
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
    result: Dict[str, Any] = {
        "letter": letter,
        "emoji": emoji_data["emoji"],
        "emoji_name": emoji_data["name"],
        "display_text": f"{letter} is for {emoji_data['name']}",
        "timestamp": int(time.time()),
    }

    history = [item for item in history if item["letter"] != letter]
    history.append(
        {
            "letter": letter,
            "emoji": emoji_data["emoji"],
            "emoji_name": emoji_data["name"],
            "timestamp": result["timestamp"],
            "error": 0,
        }
    )
    session["history"] = history[-99:]
    session["current_letter"] = letter

    return jsonify(result)


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
    current_letter: str = session.get("current_letter", "")

    filtered_history: List[Dict[str, Any]] = [
        item for item in history if item["letter"] != current_letter
    ]

    return jsonify(filtered_history)


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
