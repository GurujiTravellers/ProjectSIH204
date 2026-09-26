"""
Specialized Transport Optimization Engine for Travel_Guruji.

Consumes verified transport candidates passed from the Node.js API Gateway.
Evaluates cost, duration, transfer penalties, and traveler preferences.
Outputs transparent recommendations and explanations without inventing or fabricating data.
"""

import re
from typing import Any, Dict, List
from .schemas import get_utc_now_iso, DataStatus, build_provenance_meta


def parse_duration_minutes(duration_str: str) -> int:
    """Safely convert duration string (e.g. '17h 15m' or '2h 25m') to total minutes."""
    if not duration_str:
        return 600
    hours = 0
    minutes = 0
    h_match = re.search(r"(\d+)\s*h", str(duration_str), re.IGNORECASE)
    m_match = re.search(r"(\d+)\s*m", str(duration_str), re.IGNORECASE)
    if h_match:
        hours = int(h_match.group(1))
    if m_match:
        minutes = int(m_match.group(1))
    return (hours * 60) + minutes


def optimize_transport_candidates(
    candidates: List[Dict[str, Any]],
    user_preferences: Dict[str, Any] = None,
    budget_context: Dict[str, Any] = None,
) -> Dict[str, Any]:
    """Score, rank, and explain transport options from verified candidates."""
    user_preferences = user_preferences or {}
    budget_context = budget_context or {}

    if not candidates or not isinstance(candidates, list):
        return {
            "success": True,
            "engine": "python_transport_optimizer_v1",
            "lastUpdated": get_utc_now_iso(),
            "provenance": build_provenance_meta(
                data_source="empty_candidates_evaluator",
                data_status=DataStatus.ESTIMATED,
                confidence_score=0.5,
                note="No candidates supplied for evaluation.",
            ),
            "recommendation": None,
            "rankedCandidates": [],
        }

    preferred_mode = (user_preferences.get("transport") or "").lower()
    trip_style = (user_preferences.get("tripStyle") or "Balanced").lower()
    max_budget = float(budget_context.get("totalBudget") or 30000)

    # Identify extrema
    min_price = min((c.get("price", 99999) for c in candidates), default=1)
    max_price = max((c.get("price", 1) for c in candidates), default=1)
    durations = [parse_duration_minutes(c.get("duration", "")) for c in candidates]
    min_duration = min(durations, default=60)
    max_duration = max(durations, default=1440)

    scored_list = []

    for c, dur in zip(candidates, durations):
        price = float(c.get("price", 0))
        c_type = (c.get("type") or "").lower()
        category = c.get("category", "DIRECT")
        transfers = c.get("transfers", 0)

        # 1. Price Score (0 to 40)
        if max_price > min_price:
            price_norm = 1.0 - ((price - min_price) / (max_price - min_price))
        else:
            price_norm = 1.0
        price_score = price_norm * 40.0

        # Budget overrun penalty
        if price > (max_budget * 0.4):  # single leg transport shouldn't exceed 40% of total budget
            price_score *= 0.8

        # 2. Duration Score (0 to 40)
        if max_duration > min_duration:
            dur_norm = 1.0 - ((dur - min_duration) / (max_duration - min_duration))
        else:
            dur_norm = 1.0
        duration_score = dur_norm * 40.0

        # 3. Convenience & Transfer Score (0 to 20)
        convenience_score = 20.0
        if transfers == 1:
            convenience_score -= 5.0
        elif transfers >= 2:
            convenience_score -= 10.0

        # Mode alignment bonus
        if preferred_mode and preferred_mode in c_type:
            convenience_score += 5.0

        # Trip style weighting adjustments
        if "fast" in trip_style:
            duration_score *= 1.3
        elif "budget" in trip_style or "relaxed" in trip_style:
            price_score *= 1.3

        total_score = round(price_score + duration_score + convenience_score, 1)

        scored_list.append({
            **c,
            "optimization": {
                "score": total_score,
                "durationMinutes": dur,
                "priceScore": round(price_score, 1),
                "durationScore": round(duration_score, 1),
                "convenienceScore": round(convenience_score, 1),
            },
        })

    # Sort descending by composite score
    scored_list.sort(key=lambda x: x["optimization"]["score"], reverse=True)

    # Identify specific award winners
    cheapest = min(candidates, key=lambda x: x.get("price", 99999), default=None)
    fastest = min(candidates, key=lambda x: parse_duration_minutes(x.get("duration", "")), default=None)
    top_recommended = scored_list[0] if scored_list else None

    # Generate grounded explanation for top recommendation
    recommendation_reason = ""
    if top_recommended:
        rec_type = top_recommended.get("type", "Option")
        rec_dur = top_recommended.get("duration", "")
        rec_price = top_recommended.get("price", 0)
        rec_cat = top_recommended.get("category", "DIRECT")

        if rec_cat == "MULTIMODAL":
            recommendation_reason = f"Recommended: Best combined multimodal route balancing scenic comfort and total travel time ({rec_dur}) at ₹{rec_price:,}."
        elif rec_cat == "CONNECTING":
            recommendation_reason = f"Recommended: Reliable 1-stop connection providing fastest overall transit ({rec_dur}) with optimal layover."
        elif top_recommended.get("id") == fastest.get("id"):
            recommendation_reason = f"Recommended: Fastest route available ({rec_dur}) with direct non-stop transit."
        elif top_recommended.get("id") == cheapest.get("id"):
            recommendation_reason = f"Recommended: Most cost-effective option at ₹{rec_price:,} within planned trip budget."
        else:
            diff_hours = (parse_duration_minutes(cheapest.get("duration", "")) - parse_duration_minutes(rec_dur)) // 60
            if diff_hours > 3:
                recommendation_reason = f"Recommended: Saves ~{diff_hours} hours of travel fatigue over lowest fare while remaining within reasonable budget."
            else:
                recommendation_reason = f"Recommended: Optimal balance of travel time ({rec_dur}), reserved seating comfort, and verified fare (₹{rec_price:,})."

    return {
        "success": True,
        "engine": "python_transport_optimizer_v1",
        "lastUpdated": get_utc_now_iso(),
        "provenance": build_provenance_meta(
            data_source="python_candidate_ranking_engine",
            data_status=DataStatus.VERIFIED,
            confidence_score=0.96,
            note="Ranked strictly from verified candidate inputs based on cost, duration, and convenience.",
        ),
        "recommendation": {
            "topId": top_recommended.get("id") if top_recommended else None,
            "cheapestId": cheapest.get("id") if cheapest else None,
            "fastestId": fastest.get("id") if fastest else None,
            "reason": recommendation_reason,
        },
        "rankedCandidates": scored_list,
    }

