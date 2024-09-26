from typing import Dict, List
import yaml
import random


def load_emoji_dict() -> Dict[str, List[Dict[str, str]]]:
    """
    Loads the emoji dictionary from the YAML file.

    :return: A dictionary containing emojis for each letter.
    """
    with open("src/emojis_no_country.yaml", "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


emoji_dict: Dict[str, List[Dict[str, str]]] = load_emoji_dict()


def get_random_emoji(letter: str) -> Dict[str, str]:
    """
    Retrieves a random emoji and its name for the given letter.

    :param letter: The letter for which to get the emoji.
    :return: A dictionary containing the emoji and its name.
    """
    chosen_emoji: Dict[str, str] = random.choice(
        emoji_dict.get(letter.upper(), [{"emoji": "❓", "name": "Question"}])
    )
    return chosen_emoji
