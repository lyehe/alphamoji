from typing import Dict, List, Any


def calculate_statistics(history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes statistics based on game history.

    :param history: The game history.
    :return: A dictionary containing calculated statistics.
    """
    total_attempts: int = len(history)
    total_errors: int = sum(item.get("error", 0) for item in history)
    accuracy: float = (
        (total_attempts / (total_attempts + total_errors)) * 100
        if total_attempts > 0
        else 0.0
    )

    return {
        "total_attempts": total_attempts,
        "total_errors": total_errors,
        "accuracy": round(accuracy, 2),
    }
