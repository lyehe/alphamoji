from typing import Dict, List, Any
import random
import time
from src.emoji_utils import get_random_emoji


def generate_random_letter(current_letter: str) -> str:
    """
    Generates a random letter different from the current one.

    :param current_letter: The current letter to avoid.
    :return: A new random letter.
    """
    available_letters: List[str] = [
        chr(i) for i in range(65, 91) if chr(i) != current_letter
    ]
    return random.choice(available_letters)


def create_letter_result(letter: str) -> Dict[str, Any]:
    """
    Creates a result dictionary for a given letter.

    :param letter: The letter to create a result for.
    :return: A dictionary containing letter and emoji information.
    """
    emoji_data: Dict[str, str] = get_random_emoji(letter)
    timestamp: int = int(time.time())

    return {
        "letter": letter,
        "emoji": emoji_data["emoji"],
        "emoji_name": emoji_data["name"],
        "display_text": f"{letter} is for {emoji_data['name']}",
        "timestamp": timestamp,
        "error": 0,
        "time_taken": None,
    }


