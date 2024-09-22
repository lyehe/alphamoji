from flask import Flask, render_template, jsonify, session
from typing import Dict, List, Any
import random
import os

# Create a Flask application instance
app: Flask = Flask(__name__)
# Set a secure random secret key for the session
app.secret_key = os.urandom(24)

def get_random_emoji(letter: str) -> Dict[str, str]:
    # Dictionary containing emojis and their names for each letter
    emoji_dict: Dict[str, List[Dict[str, str]]] = {
        "A": [
            {"emoji": "🍎", "name": "Apple"},
            {"emoji": "✈️", "name": "Airplane"},
            {"emoji": "👽", "name": "Alien"},
            {"emoji": "🐜", "name": "Ant"},
            {"emoji": "🦅", "name": "Eagle"},
            {"emoji": "🚑", "name": "Ambulance"},
        ],
        "B": [
            {"emoji": "🍌", "name": "Banana"},
            {"emoji": "🐻", "name": "Bear"},
            {"emoji": "🎈", "name": "Balloon"},
            {"emoji": "🦋", "name": "Butterfly"},
            {"emoji": "🍞", "name": "Bread"},
            {"emoji": "🦇", "name": "Bat"},
        ],
        "C": [
            {"emoji": "🍪", "name": "Cookie"},
            {"emoji": "🐱", "name": "Cat"},
            {"emoji": "🤠", "name": "Cowboy"},
            {"emoji": "🎪", "name": "Circus"},
            {"emoji": "🐄", "name": "Cow"},
            {"emoji": "🥕", "name": "Carrot"},
        ],
        "D": [
            {"emoji": "🦕", "name": "Dinosaur"},
            {"emoji": "🐶", "name": "Dog"},
            {"emoji": "🍩", "name": "Donut"},
            {"emoji": "🐬", "name": "Dolphin"},
            {"emoji": "💃", "name": "Dancer"},
            {"emoji": "🎲", "name": "Dice"},
        ],
        "E": [
            {"emoji": "🐘", "name": "Elephant"},
            {"emoji": "🥚", "name": "Egg"},
            {"emoji": "👁️", "name": "Eye"},
            {"emoji": "🦅", "name": "Eagle"},
            {"emoji": "🎧", "name": "Earphones"},
            {"emoji": "🧝", "name": "Elf"},
            {"emoji": "👀", "name": "Eyes"},
        ],
        "F": [
            {"emoji": "🐸", "name": "Frog"},
            {"emoji": "🦊", "name": "Fox"},
            {"emoji": "🍟", "name": "Fries"},
            {"emoji": "🐠", "name": "Fish"},
            {"emoji": "🔥", "name": "Fire"},
            {"emoji": "🦩", "name": "Flamingo"},
        ],
        "G": [
            {"emoji": "🦒", "name": "Giraffe"},
            {"emoji": "🍇", "name": "Grapes"},
            {"emoji": "🎸", "name": "Guitar"},
            {"emoji": "👻", "name": "Ghost"},
            {"emoji": "🦍", "name": "Gorilla"},
            {"emoji": "🧤", "name": "Gloves"},
        ],
        "H": [
            {"emoji": "🐹", "name": "Hamster"},
            {"emoji": "🏠", "name": "House"},
            {"emoji": "🎩", "name": "Hat"},
            {"emoji": "🚁", "name": "Helicopter"},
            {"emoji": "🐴", "name": "Horse"},
            {"emoji": "🔨", "name": "Hammer"},
            {"emoji": "🦔", "name": "Hedgehog"},
            {"emoji": "🧗", "name": "Climbing"},
        ],
        "I": [
            {"emoji": "🍦", "name": "Icecream"},
            {"emoji": "🏝️", "name": "Island"},
            {"emoji": "🧊", "name": "Ice"},
        ],
        "J": [
            {"emoji": "🤹", "name": "Juggler"},
            {"emoji": "🕹️", "name": "Joystick"},
            {"emoji": "🧃", "name": "Juice"},
            {"emoji": "👖", "name": "Jeans"},
            {"emoji": "🃏", "name": "Joker"},
        ],
        "K": [
            {"emoji": "🪁", "name": "Kite"},
            {"emoji": "🔑", "name": "Key"},
            {"emoji": "🥝", "name": "Kiwi"},
            {"emoji": "👑", "name": "King"},
            {"emoji": "🦘", "name": "Kangaroo"},
            {"emoji": "🔪", "name": "Knife"},
        ],
        "L": [
            {"emoji": "🦁", "name": "Lion"},
            {"emoji": "🍋", "name": "Lemon"},
            {"emoji": "🦎", "name": "Lizard"},
            {"emoji": "💡", "name": "Lamp"},
            {"emoji": "🍃", "name": "Leaf"},
            {"emoji": "🦙", "name": "Llama"},
        ],
        "M": [
            {"emoji": "🐒", "name": "Monkey"},
            {"emoji": "🌙", "name": "Moon"},
            {"emoji": "🍄", "name": "Mushroom"},
            {"emoji": "🧲", "name": "Magnet"},
            {"emoji": "🎭", "name": "Mask"},
            {"emoji": "🦟", "name": "Mosquito"},
        ],
        "N": [
            {"emoji": "👃", "name": "Nose"},
            {"emoji": "🎶", "name": "Notes"},
            {"emoji": "🌃", "name": "Night"},
            {"emoji": "🪺", "name": "Nest"},
            {"emoji": "📰", "name": "Newspaper"},
        ],
        "O": [
            {"emoji": "🐙", "name": "Octopus"},
            {"emoji": "🦉", "name": "Owl"},
            {"emoji": "🍊", "name": "Orange"},
            {"emoji": "🧅", "name": "Onion"},
            {"emoji": "🦦", "name": "Otter"},
        ],
        "P": [
            {"emoji": "🐼", "name": "Panda"},
            {"emoji": "🍑", "name": "Peach"},
            {"emoji": "🥧", "name": "Pie"},
            {"emoji": "🦜", "name": "Parrot"},
            {"emoji": "🖊️", "name": "Pen"},
            {"emoji": "🥔", "name": "Potato"},
        ],
        "Q": [
            {"emoji": "👸", "name": "Queen"},
            {"emoji": "🦆", "name": "Quack"},
            {"emoji": "🧸", "name": "Quilt"},
            {"emoji": "❓", "name": "Question"},
        ],
        "R": [
            {"emoji": "🌈", "name": "Rainbow"},
            {"emoji": "🤖", "name": "Robot"},
            {"emoji": "🚀", "name": "Rocket"},
            {"emoji": "🌹", "name": "Rose"},
            {"emoji": "🐰", "name": "Rabbit"},
            {"emoji": "📻", "name": "Radio"},
        ],
        "S": [
            {"emoji": "⭐", "name": "Star"},
            {"emoji": "🍓", "name": "Strawberry"},
            {"emoji": "☀️", "name": "Sun"},
            {"emoji": "🐿️", "name": "Squirrel"},
            {"emoji": "🦈", "name": "Shark"},
            {"emoji": "🧦", "name": "Socks"},
        ],
        "T": [
            {"emoji": "🐯", "name": "Tiger"},
            {"emoji": "🌳", "name": "Tree"},
            {"emoji": "🍅", "name": "Tomato"},
            {"emoji": "🦃", "name": "Turkey"},
            {"emoji": "🚂", "name": "Train"},
            {"emoji": "🐢", "name": "Turtle"},
        ],
        "U": [
            {"emoji": "☂️", "name": "Umbrella"},
            {"emoji": "🦄", "name": "Unicorn"},
            {"emoji": "🛸", "name": "UFO"},
            {"emoji": "🧛", "name": "Undead"},
            {"emoji": "🦺", "name": "Uniform"},
        ],
        "V": [
            {"emoji": "🏐", "name": "Volleyball"},
            {"emoji": "🌋", "name": "Volcano"},
            {"emoji": "🚐", "name": "Van"},
            {"emoji": "🎻", "name": "Violin"},
            {"emoji": "🦺", "name": "Vest"},
            {"emoji": "🥕", "name": "Vegetable"},
        ],
        "W": [
            {"emoji": "🌊", "name": "Wave"},
            {"emoji": "🐺", "name": "Wolf"},
            {"emoji": "🍉", "name": "Watermelon"},
            {"emoji": "⌚", "name": "Watch"},
            {"emoji": "🪄", "name": "Wand"},
            {"emoji": "🧇", "name": "Waffle"},
            {"emoji": "🧙", "name": "Wizard"},
        ],
        "X": [
            {"emoji": "❌", "name": "Xmark"},
        ],
        "Y": [
            {"emoji": "🪀", "name": "Yoyo"},
            {"emoji": "🧒", "name": "Youth"},
            {"emoji": "🧘", "name": "Yoga"},
            {"emoji": "🐋", "name": "Whale"},
            {"emoji": "💛", "name": "Yellow"},
            {"emoji": "☯️", "name": "Yinyang"},
        ],
        "Z": [
            {"emoji": "🦓", "name": "Zebra"},
            {"emoji": "🧟", "name": "Zombie"},
            {"emoji": "🦊", "name": "Zorro"},
            {"emoji": "💤", "name": "Zzz"},
        ],
    }
    # Choose a random emoji for the given letter
    chosen_emoji: Dict[str, str] = random.choice(
        emoji_dict.get(letter.upper(), [{"emoji": "❓", "name": "Question"}])
    )
    return chosen_emoji

# Route for the main page
@app.route("/")
def index() -> str:
    # Initialize session variables
    session["history"] = []
    session["current_letter"] = ""
    # Render the main template
    return render_template("alphabet.html")

# Route to get a random letter and associated emoji
@app.route("/get_random_letter")
def get_random_letter() -> Any:
    # Retrieve history and current letter from session
    history: List[Dict[str, str]] = session.get("history", [])
    current_letter: str = session.get("current_letter", "")
    
    # Generate a list of available letters (excluding the current letter)
    available_letters: List[str] = [
        chr(i) for i in range(65, 91) 
        if chr(i) != current_letter
    ]
    
    # Choose a random letter and get its associated emoji
    letter: str = random.choice(available_letters)
    emoji_data: Dict[str, str] = get_random_emoji(letter)
    result: Dict[str, str] = {
        "letter": letter,
        "emoji": emoji_data["emoji"],
        "emoji_name": emoji_data["name"],
        "display_text": f"{letter} is for {emoji_data['name']}",
    }

    # Update history, removing any previous occurrence of the chosen letter
    history = [item for item in history if item["letter"] != letter]
    history.append(result)
    session["history"] = history[-99:]  # Keep only the last 99 items
    session["current_letter"] = letter

    # Return the result as JSON
    return jsonify(result)

# Route to get the history of letters and emojis
@app.route("/get_history")
def get_history() -> Any:
    # Retrieve history and current letter from session
    history: List[Dict[str, str]] = session.get("history", [])
    current_letter: str = session.get("current_letter", "")
    
    # Filter out the current letter from the history
    filtered_history: List[Dict[str, str]] = [
        item for item in history if item["letter"] != current_letter
    ]
    
    # Return the filtered history as JSON
    return jsonify(filtered_history)

# Run the Flask application
if __name__ == "__main__":
    app.run()
