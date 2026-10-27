"""
DesignVerse Learning Engine — XP Engine
Append-only XP ledger, server-computed levels.
"""
from __future__ import annotations
import json
import time
from pathlib import Path
from typing import Optional

# Load level thresholds from content data
_LEVELS_PATH = Path(__file__).parent.parent.parent.parent / "learning_content" / "levels" / "levels.json"

def _load_levels() -> list[dict]:
    try:
        with open(_LEVELS_PATH, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        # Fallback hardcoded thresholds
        return [
            {"level_id": 1, "xp_required": 0},
            {"level_id": 2, "xp_required": 300},
            {"level_id": 3, "xp_required": 700},
            {"level_id": 4, "xp_required": 1500},
            {"level_id": 5, "xp_required": 3000},
            {"level_id": 6, "xp_required": 5500},
            {"level_id": 7, "xp_required": 9000},
            {"level_id": 8, "xp_required": 14000},
            {"level_id": 9, "xp_required": 20000},
            {"level_id": 10, "xp_required": 28000},
        ]

LEVELS = _load_levels()

# In-memory ledger (replace with DB in Phase 9)
_ledger: dict[str, list[dict]] = {}  # user_id -> list of XP events


class XPEngine:
    """Append-only XP ledger with idempotency via event_id."""

    @staticmethod
    def award(user_id: str, event_id: str, source: str, xp: int, meta: Optional[dict] = None) -> dict:
        """
        Award XP to a user. Idempotent — duplicate event_id is ignored.
        Returns the new XP total and level.
        """
        user_ledger = _ledger.setdefault(user_id, [])
        # Idempotency check
        existing_ids = {e["event_id"] for e in user_ledger}
        if event_id in existing_ids:
            return XPEngine.get_status(user_id)

        entry = {
            "event_id": event_id,
            "source": source,
            "xp": xp,
            "timestamp": time.time(),
            "meta": meta or {},
        }
        user_ledger.append(entry)
        return XPEngine.get_status(user_id)

    @staticmethod
    def get_total_xp(user_id: str) -> int:
        return sum(e["xp"] for e in _ledger.get(user_id, []))

    @staticmethod
    def compute_level(total_xp: int) -> int:
        current_level = 1
        for lvl in LEVELS:
            if total_xp >= lvl["xp_required"]:
                current_level = lvl["level_id"]
            else:
                break
        return current_level

    @staticmethod
    def get_status(user_id: str) -> dict:
        total = XPEngine.get_total_xp(user_id)
        level = XPEngine.compute_level(total)

        # Next level threshold
        next_lvl_data = next((l for l in LEVELS if l["level_id"] == level + 1), None)
        next_xp = next_lvl_data["xp_required"] if next_lvl_data else None
        progress_pct = 0
        if next_xp:
            current_lvl_xp = next(l["xp_required"] for l in LEVELS if l["level_id"] == level)
            span = next_xp - current_lvl_xp
            earned = total - current_lvl_xp
            progress_pct = round(min(100, max(0, (earned / span) * 100)), 1)

        level_data = next((l for l in LEVELS if l["level_id"] == level), {})
        return {
            "user_id": user_id,
            "total_xp": total,
            "level": level,
            "level_title": level_data.get("title", f"Level {level}"),
            "level_badge": level_data.get("badge_icon", "⭐"),
            "next_level_xp": next_xp,
            "progress_pct": progress_pct,
            "event_count": len(_ledger.get(user_id, [])),
        }

    @staticmethod
    def get_history(user_id: str) -> list[dict]:
        return list(_ledger.get(user_id, []))
