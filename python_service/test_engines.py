"""
Unit tests for Python Intelligence Service engines.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from engines.schemas import DataStatus
from engines.itinerary_optimizer import optimize_itinerary
from engines.budget_optimizer import optimize_budget


def test_engines():
    print("Testing Itinerary Optimizer...")
    itin = optimize_itinerary(
        trip_context={"destination": "Manali", "startDate": "2026-10-15", "days": 3},
        preferences={"walking": "Low / Minimal", "food": "Vegetarian / Pure Veg", "tripStyle": "Relaxed"},
        candidate_attractions=[
            {"name": "Solang Valley", "category": "Scenic", "walking": "medium", "cost": 0},
            {"name": "Hadimba Temple", "category": "Culture", "walking": "low", "cost": 50},
        ],
        real_time_context={
            "weather": {
                "status": "LIVE",
                "forecast": [{"precipitationProbability": 10}, {"precipitationProbability": 70}],
            }
        },
    )
    assert itin["engine"] == "python_itinerary_optimizer_v1"
    assert len(itin["itinerary"]) == 3
    assert itin["itinerary"][0]["timeBlocks"][0]["dataStatus"] == DataStatus.DATABASE.value
    print("  -> Itinerary Optimizer PASSED")

    print("Testing Budget Optimizer (Normal Budget)...")
    budget = optimize_budget(
        trip_context={"destination": "Manali", "days": 3, "origin": "New Delhi"},
        budget_context={"totalBudget": 35000, "selectedHotelPrice": 3200},
        preferences={"accommodation": "Mid-Range", "transport": "Train", "food": "Vegetarian / Pure Veg"},
    )
    assert budget["engine"] == "python_budget_optimizer_v1"
    assert not budget["isOverBudget"]
    assert len(budget["items"]) == 6
    assert budget["items"][0]["status"] == "CONFIRMED"
    assert budget["items"][0]["dataStatus"] == DataStatus.VERIFIED.value
    print("  -> Budget Optimizer (Normal) PASSED")

    print("Testing Budget Optimizer (Over Budget)...")
    over_budget = optimize_budget(
        trip_context={"destination": "Manali", "days": 4},
        budget_context={"totalBudget": 10000},
        preferences={"accommodation": "Luxury", "transport": "Flight"},
    )
    assert over_budget["isOverBudget"]
    assert len(over_budget["alternatives"]) > 0
    print("  -> Budget Optimizer (Over Budget) PASSED")

    print("\nALL PYTHON ENGINE TESTS PASSED!")


if __name__ == "__main__":
    test_engines()

